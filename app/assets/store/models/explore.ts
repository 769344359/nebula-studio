import { createModel } from '@rematch/core';
import { message } from 'antd';
import * as d3 from 'd3';
import _ from 'lodash';
import intl from 'react-intl-universal';

import service from '#assets/config/service';
import {
  fetchBidirectVertexes,
  fetchEdgeProps,
  fetchVertexProps,
  fetchVertexPropsWithIndex,
} from '#assets/utils/fetch';
import { convertBigNumberToString } from '#assets/utils/function';
import { getExploreGQL } from '#assets/utils/gql';
import { idToString, nebulaToData, setLink } from '#assets/utils/nebulaToData';

export interface INode extends d3.SimulationNodeDatum {
  name: string;
  group?: number;
}

export interface IEdge extends d3.SimulationLinkDatum<INode> {
  id: string;
  source: INode;
  target: INode;
  size: number;
  type: string;
}

interface IExportEdge {
  srcId: string;
  dstId: string;
  rank: string;
  edgeType: string;
}

interface IExportData {
  vertexes: string[];
  edges: IExportEdge[];
}
interface IState {
  vertexes: INode[];
  edges: IEdge[];
  selectVertexes: INode[];
  actionData: any[];
  step: number;
  exploreRules: {
    edgeTypes?: string[];
    edgeDirection?: string;
    vertexColor?: string;
    quantityLimit?: number;
  };
  preloadData: IExportData;
  showTagFields: string[];
  showEdgeFields: string[];
}
function getGroup(headers) {
  const tags = headers
    ? _.sortedUniq(
        headers
          .map(field => {
            if (field === 'VertexID') {
              return '';
            } else {
              return field.split('.')[0];
            }
          })
          .filter(i => i !== ''),
      )
    : [];
  return 't' + tags.sort().join('-');
}
function getTagData(nodeProps, expand) {
  if (nodeProps.headers.length && nodeProps.tables.length) {
    let group;
    if (expand && expand.vertexColor !== 'groupByTag') {
      group = 'step-' + expand.exploreStep;
    } else {
      group = getGroup(nodeProps.headers);
    }
    const vertexes = nodeProps.tables.map(item => {
      const nodeProp = {
        headers: nodeProps.headers,
        tables: [item],
      };
      if (expand) {
        return {
          name: item.VertexID,
          nodeProp,
          group,
        };
      } else {
        return {
          name: item.VertexID,
          step: 0,
          group,
          nodeProp,
        };
      }
    });
    return vertexes;
  } else {
    return [];
  }
}

function getBidrectVertexIds(data) {
  const { tables } = data;
  const ids = _.uniq(
    tables
      .map(row => {
        return Object.values(row);
      })
      .flat(),
  )
    .filter(id => id !== 0)
    .map(id => String(id));
  return ids;
}

export const explore = createModel({
  state: {
    vertexes: [],
    edges: [],
    selectVertexes: [],
    actionData: [],
    step: 0,
    exploreRules: {
      edgeTypes: [],
      edgeDirection: '',
      vertexColor: '',
      quantityLimit: null,
    },
    preloadData: {
      vertexes: [],
      edges: [],
    },
    showTagFields: [],
    showEdgeFields: [],
  },
  reducers: {
    update: (state: IState, payload: any): IState => {
      if (payload.edges) {
        setLink(payload.edges);
      }
      return {
        ...state,
        ...payload,
      };
    },

    addNodesAndEdges: (state: IState, payload: IState): IState => {
      const {
        vertexes: originVertexes,
        edges: originEdges,
        selectVertexes,
        actionData,
      } = state;
      const { vertexes: addVertexes, edges: addEdges } = payload;

      const svg: any = d3.select('.output-graph');
      addVertexes.map(d => {
        d.x =
          _.meanBy(selectVertexes, 'x') ||
          svg.node().getBoundingClientRect().width / 2;
        d.y =
          _.meanBy(selectVertexes, 'y') ||
          svg.node().getBoundingClientRect().height / 2;
      });
      const edges = _.uniqBy([...originEdges, ...addEdges], e => e.id);
      setLink(edges);
      const vertexes = _.uniqBy([...originVertexes, ...addVertexes], v =>
        convertBigNumberToString(v.name),
      );
      actionData.push({
        type: 'ADD',
        vertexes: _.differenceBy(addVertexes, originVertexes, v =>
          convertBigNumberToString(v.name),
        ),
        edges: _.differenceBy(
          addEdges,
          originEdges,
          v => '`' + v.type + '`' + v.id,
        ),
      });
      return {
        ...state,
        edges,
        vertexes,
        actionData,
      };
    },

    clear: () => {
      return {
        vertexes: [],
        edges: [],
        selectVertexes: [],
        actionData: [],
        step: 0,
        exploreRules: {
          edgeTypes: [],
          edgeDirection: '',
          vertexColor: '',
        },
        preloadData: {
          vertexes: [],
          edges: [],
        },
        showTagFields: [],
        showEdgeFields: [],
      };
    },
  },
  effects: (dispatch: any) => ({
    async asyncGetVertexes(payload: {
      ids: string[];
      useHash?: string;
      expand?: {
        vertexColor: string;
        exploreStep;
      };
    }) {
      const { ids, useHash, expand } = payload;
      let newVertexes: any = [];
      if (ids.length === 1) {
        const nodeData = await fetchVertexProps({ ids, useHash });
        if (nodeData.code === 0) {
          newVertexes = getTagData(nodeData.data, expand);
        }
      } else if (ids.length > 1) {
        const tagData = await dispatch.nebula.asyncGetTags();
        const tags = tagData.code === 0 ? tagData.data.map(i => i.Name) : [];
        const tagNodes = await Promise.all(
          tags.map(async tag => {
            const nodesData = await fetchVertexProps({ ids, useHash, tag });
            return nodesData.code === 0
              ? getTagData(nodesData.data, expand)
              : undefined;
          }),
        );
        const flattenVertexes = _.flatten(tagNodes).filter(
          i => i !== undefined,
        );
        const vertexTags: any = {};
        flattenVertexes.forEach((item: any) => {
          const id = item.name;
          if (vertexTags[id]) {
            const { headers, tables } = vertexTags[id].nodeProp;
            const data = tables[0];
            const newHeaders = _.union(headers, item.nodeProp.headers);
            const nodeProp = {
              headers: newHeaders,
              tables: [_.assign(data, item.nodeProp.tables[0])],
            };
            vertexTags[id].nodeProp = nodeProp;
            vertexTags[id].group = getGroup(newHeaders);
          } else {
            vertexTags[id] = item;
          }
        });
        newVertexes = Object.values(vertexTags);
      }
      newVertexes = await this.asyncCheckVertexesExist({
        preAddVertexes: newVertexes,
        inputIds: ids.map(id => String(id)),
        expand,
      });
      return newVertexes;
    },

    async asyncImportNodes(payload: { ids: string[]; useHash?: string }) {
      const { ids, useHash } = payload;
      const vertexes = await this.asyncGetExploreVertex({ ids, useHash });
      this.addNodesAndEdges({
        vertexes,
        edges: [],
      });
    },

    async deleteNodesAndEdges(payload: {
      selectVertexes: any[];
      vertexes: INode[];
      edges: IEdge[];
      actionData: any[];
    }) {
      const {
        vertexes: originVertexes,
        edges,
        selectVertexes,
        actionData,
      } = payload;
      const originEdges = [...edges];
      selectVertexes.forEach(selectVertexe => {
        _.remove(
          originEdges,
          v =>
            v.source.name === selectVertexe.name ||
            v.target.name === selectVertexe.name,
        );
      });
      const vertexes = _.differenceBy(
        originVertexes,
        selectVertexes,
        v => v.name,
      );
      actionData.push({
        type: 'REMOVE',
        vertexes: selectVertexes,
        edges: _.differenceBy(
          edges,
          originEdges,
          v => '`' + v.type + '`' + v.id,
        ),
      });
      this.update({
        vertexes,
        edges: originEdges,
        actionData,
        selectVertexes: [],
      });
    },

    async asyncGetExpand(payload: {
      selectVertexes: any[];
      edgeTypes: string[];
      edgesFields: any[];
      edgeDirection: string;
      filters: any[];
      exploreStep: number;
      vertexColor: string;
      quantityLimit: number | null;
    }) {
      const { edgesFields, exploreStep, vertexColor } = payload;
      const { vertexes, edges } = (await this.asyncGetExpandData(
        payload,
      )) as any;
      await this.asyncAddGraph({
        edges,
        vertexes,
        expand: {
          vertexColor,
          exploreStep,
          edgesFields,
        },
      });
    },

    async asyncImportNodesWithIndex(payload: {
      tag: string;
      filters: any[];
      quantityLimit: number | null;
    }) {
      const { code, data, message } = await fetchVertexPropsWithIndex(payload);
      if (code === 0 && data.tables.length !== 0) {
        const ids = data.tables && data.tables.map(i => i.VertexID);
        this.asyncImportNodes({ ids });
      } else {
        throw new Error(message);
      }
    },

    async asyncGetExploreVertex(payload: { ids: string[]; useHash?: string }) {
      const { ids, useHash } = payload;
      const _ids = _.uniq(ids);
      const vertexes: any =
        _ids.length > 0
          ? await this.asyncGetVertexes({
              ids: _ids,
              useHash,
            })
          : [];
      return _.uniqBy(vertexes, (i: any) =>
        convertBigNumberToString(i.name),
      ).filter(i => i !== undefined);
    },

    // check if vertex exist
    async asyncCheckVertexesExist(payload: {
      preAddVertexes;
      inputIds: string[];
      expand;
    }) {
      const { preAddVertexes, inputIds, expand } = payload;
      const preAddIds = preAddVertexes.map(i => String(i.name));
      if (preAddIds.length !== inputIds.length) {
        const notIncludedIds = _.xor(preAddIds, inputIds);
        const existedIds = (await this.asyncGetVertexesOnHaningEdge({
          ids: notIncludedIds,
        })) as any;
        const notExistIds = notIncludedIds.filter(
          id => !existedIds.includes(id),
        );
        const addIds = notIncludedIds.filter(id => existedIds.includes(id));
        if (notExistIds.length > 0) {
          message.warning(
            `${notExistIds.join(', ')}${intl.get('import.notExist')}`,
          );
        }
        addIds.forEach(id => {
          const vertex: any = {
            name: Number(id),
            nodeProp: {
              headers: ['VertexID'],
              tables: [{ VertexID: Number(id) }],
            },
          };
          if (expand && expand.vertexColor !== 'groupByTag') {
            vertex.group = 'step-' + expand.exploreStep;
          } else if (expand) {
            vertex.group = 't';
          } else {
            vertex.step = 0;
          }
          preAddVertexes.push(vertex);
        });
      }
      return preAddVertexes;
    },

    async asyncGetVertexesOnHaningEdge(payload: { ids: string[] }) {
      const { ids } = payload;
      let bidirectRes = await fetchBidirectVertexes({ ids });
      let _ids =
        bidirectRes.code === 0 ? getBidrectVertexIds(bidirectRes.data) : [];
      bidirectRes = await fetchBidirectVertexes({ ids: _ids });
      _ids =
        bidirectRes.code === 0 ? getBidrectVertexIds(bidirectRes.data) : [];
      return _ids;
    },

    async asyncGetExploreEdge(edgeList: IExportEdge[]) {
      let _edges = [];
      if (edgeList.length > 0) {
        const type = edgeList[0].edgeType;
        const res = await fetchEdgeProps({
          idRoutes: edgeList.map(i => `${i.srcId}->${i.dstId}@${i.rank}`),
          type,
        });
        _edges = res.tables.map(item => {
          const edgeProp = {
            headers: res.headers,
            tables: [item],
          };
          return {
            source: convertBigNumberToString(item[`${type}._src`]),
            target: convertBigNumberToString(item[`${type}._dst`]),
            id: `${type} ${item[`${type}._src`]}->${item[`${type}._dst`]}@${
              item[`${type}._rank`]
            }`,
            type,
            edgeProp,
          };
        });
      }
      return _edges;
    },

    async asyncGetExploreInfo(data: IExportData) {
      const { vertexes, edges } = data;
      const _vertexes = await this.asyncGetExploreVertex({ ids: vertexes });
      let _edges: any = _.groupBy(edges, e => e.edgeType);
      _edges = await Promise.all(
        Object.values(_edges).map(async item => {
          return this.asyncGetExploreEdge(item);
        }),
      );
      this.addNodesAndEdges({
        vertexes: _vertexes,
        edges: _edges.flat(),
      });
    },

    async asyncBidirectExpand(_payload, rootState) {
      const {
        nebula: { edgeTypes },
        explore: { selectVertexes },
      } = rootState;
      let vertexes = [] as any;
      let edges = [] as any;
      const {
        vertexes: incomingV,
        edges: incomingE,
      } = (await this.asyncGetExpandData({
        selectVertexes,
        edgeTypes,
        edgeDirection: 'incoming',
      })) as any;
      const {
        vertexes: outgoingV,
        edges: outgoingE,
      } = (await this.asyncGetExpandData({
        selectVertexes,
        edgeTypes,
        edgeDirection: 'outgoing',
      })) as any;
      vertexes = [...vertexes, ...incomingV, ...outgoingV];
      edges = [...edges, ...incomingE, ...outgoingE];
      await this.asyncAddGraph({
        vertexes,
        edges,
      });
    },

    async asyncGetExpandData(payload: {
      selectVertexes: any[];
      edgeTypes: string[];
      edgesFields?: any[];
      edgeDirection: string;
      filters?: any[];
      exploreStep?: number;
      vertexColor?: string;
      quantityLimit?: number | null;
    }) {
      const {
        selectVertexes,
        edgeTypes,
        edgeDirection,
        filters,
        quantityLimit,
      } = payload;
      const gql = getExploreGQL({
        selectVertexes,
        edgeTypes,
        edgeDirection,
        filters,
        quantityLimit,
      });
      const { code, data, message: errMsg } = (await service.execNGQL({
        gql,
      })) as any;
      if (code === 0) {
        const { vertexes, edges } = nebulaToData(
          idToString(data.tables),
          edgeTypes,
          edgeDirection,
        );
        return {
          vertexes,
          edges,
        };
      } else {
        message.warning(errMsg);
        return {
          vertexes: [],
          edges: [],
        };
      }
    },

    async asyncAddGraph(
      payload: {
        vertexes;
        edges;
        expand;
      },
      rootState,
    ) {
      const {
        explore: { vertexes: originVertexes, edges: originEdges },
      } = rootState;
      const { vertexes, edges, expand } = payload;
      // fetch vertexes
      const newVertexes = _.differenceBy(
        vertexes,
        originVertexes,
        (vertex: any) => convertBigNumberToString(vertex.name),
      );
      const newIds = _.uniq(
        newVertexes.map((i: any) => convertBigNumberToString(i.name)),
      );
      const _newVertexes =
        newIds.length > 0
          ? await this.asyncGetVertexes({
              ids: newIds,
              expand,
            })
          : [];
      // fetch edges
      const newEdges = _.differenceBy(
        edges,
        originEdges,
        (edge: any) => '`' + edge.type + '`' + edge.id,
      );
      const edgeTypeGroup = _.groupBy(newEdges, (edge: any) => edge.type);
      const edgeList = await Promise.all(
        Object.keys(edgeTypeGroup).map(async type => {
          const idRoutes = edgeTypeGroup[type].map((i: any) => i.id);
          const edgeFields =
            expand && expand.edgeFields
              ? _.find(expand.edgesFields, type)
              : null;
          const res = await fetchEdgeProps({
            idRoutes,
            type,
            edgeFields,
          });
          const _edges = res.tables.map(item => {
            const edgeProp = {
              headers: res.headers,
              tables: [item],
            };
            return {
              source: convertBigNumberToString(item[`${type}._src`]),
              target: convertBigNumberToString(item[`${type}._dst`]),
              id: `${type} ${item[`${type}._src`]}->${item[`${type}._dst`]}@${
                item[`${type}._rank`]
              }`,
              type,
              edgeProp,
            };
          });
          return _edges;
        }),
      );
      const _newEdges = _.flatten(edgeList);
      this.addNodesAndEdges({
        vertexes: _newVertexes,
        edges: _newEdges,
      });
      if (expand && expand.exploreStep) {
        this.update({
          step: expand.exploreStep,
        });
      }
    },
  }),
});
