import { Button, Table, Tabs, Tooltip, Popover } from 'antd';
import { BigNumber } from 'bignumber.js';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@app/stores';
import { trackEvent } from '@app/utils/stat';
import { v4 as uuidv4 } from 'uuid';
import Icon from '@app/components/Icon';
import { parseSubGraph } from '@app/utils/parseData';
import cls from 'classnames';
import domtoimage from 'dom-to-image';
import { GraphStore } from '@app/stores/graph';
import { useI18n } from '@vesoft-inc/i18n';
import type { HistoryResult } from '@app/stores/console';
import Explain, { convertExplainData } from '@vesoft-inc/nebula-explain-graph';
import '@vesoft-inc/nebula-explain-graph/dist/Explain.css';
import ForceGraph from './ForceGraph';

import styles from './index.module.less';

interface IProps {
  index: number;
  result: HistoryResult;
  onHistoryItem: (gql: string, space?: string) => void;
  onExplorer?: (params: { space: string; vertexes: any[]; edges: any[] }) => void;
  onResultConfig?: (data: { space: string; spaceVidType: string; [key: string]: any }) => void;
  templateRender?: (data) => JSX.Element;
}

const OutputBox = (props: IProps) => {
  const { result, onHistoryItem, index, onExplorer, onResultConfig, templateRender } = props;
  const { console } = useStore();
  const { intl } = useI18n();
  const [visible, setVisible] = useState(true);
  const nowOutputRef = useRef<HTMLDivElement>(null);
  const { results, update, favorites, saveFavorite, deleteFavorite, getFavoriteList, updateResultsStorage } = console;
  const { code, data, message, gql, space, spaceVidType } = result;
  const [columns, setColumns] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [graph, setGraph] = useState<GraphStore | null>(null);
  const [tab, setTab] = useState('');
  const [fullscreen, setFullscreen] = useState(false);

  const initData = useCallback(() => {
    let _columns = [] as any;
    let _dataSource = [] as any;
    if (!data) {
      return;
    }
    const { headers, tables, localParams } = data;
    if (tables.length > 0) {
      _dataSource = data.tables;
      setShowGraph(
        _dataSource.filter((item) => item._verticesParsedList || item._edgesParsedList || item._pathsParsedList)
          .length > 0,
      );
    }
    if (headers.length > 0) {
      _columns = data.headers.map((column) => {
        return {
          title: column,
          dataIndex: column,
          sorter: (r1, r2) => {
            const v1 = r1[column];
            const v2 = r2[column];
            return v1 === v2 ? 0 : v1 > v2 ? 1 : -1;
          },
          sortDirections: ['descend', 'ascend'],
          render: (value) => {
            if (typeof value === 'boolean') {
              return value.toString();
            } else if (typeof value === 'number' || BigNumber.isBigNumber(value)) {
              return value.toString();
            }
            return value;
          },
        };
      });
    }
    if (localParams) {
      const params = {};
      Object.entries(data?.localParams).forEach(([k, v]) => (params[k] = JSON.stringify(v)));
      _dataSource = [{ ...params }];
      _columns = Object.keys(data?.localParams).map((column) => {
        return {
          title: column,
          dataIndex: column,
          render: (value) => {
            if (typeof value === 'boolean') {
              return value.toString();
            } else if (typeof value === 'number' || BigNumber.isBigNumber(value)) {
              return value.toString();
            }
            return value;
          },
        };
      });
    }
    setDataSource(_dataSource);
    setColumns(_columns);
  }, []);

  useEffect(() => {
    initData();
  }, []);

  const handleTabChange = useCallback((key) => {
    setTab(key);
    trackEvent('console', `change_tab_${key}`);
  }, []);

  const addFavorites = useCallback(async () => {
    if (!gql) {
      return;
    }
    await saveFavorite(gql);
    getFavoriteList();
  }, [gql]);
  const removeFavorite = useCallback(async () => {
    const id = console.favorites.find((item) => item.content === gql)?.id;
    await deleteFavorite(id);
    getFavoriteList();
  }, []);

  useEffect(() => {
    setIsFavorited(favorites.filter((item) => item.content === gql).length > 0);
  }, [favorites, gql]);

  const handleItemRemove = useCallback(() => {
    update({
      results: results.filter((_, i) => i !== index),
    });
    updateResultsStorage();
  }, [results, index]);

  const downloadCsv = () => {
    if (!data) {
      return;
    }
    let url = '#';
    const { headers = [], tables = [] } = data;
    const csv = [headers, ...tables.map((values) => headers.map((field) => values[field]))]
      .map((row) =>
        // HACK: waiting for use case if there need to check int or string
        row.map((value) => `"${value.toString().replace(/"/g, '""')}"`).join(','),
      )
      .join('\n');
    if (!csv) {
      return;
    }

    const _utf = '\uFEFF';
    if (window.Blob && window.URL && window.URL.createObjectURL) {
      const csvBlob = new Blob([_utf + csv], {
        type: 'text/csv',
      });
      url = URL.createObjectURL(csvBlob);
    }
    url = 'data:attachment/csv;charset=utf-8,' + _utf + encodeURIComponent(csv);
    const link = document.createElement('a');
    link.href = url;
    link.download = `result.csv`;
    link.click();
  };

  const downloadPng = async () => {
    if (graph && tab === 'graph') {
      let canvas = graph.twoGraph.canvas;
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = canvas.width;
      shadowCanvas.height = canvas.height;
      const ctx = shadowCanvas.getContext('2d');
      ctx.fillStyle = '#F3F6F9';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvas, 0, 0);
      canvas = shadowCanvas;
      setTimeout(() => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = canvas.toDataURL('image/png');
          a.download = 'Image.png';
          a.click();
          window.URL.revokeObjectURL(url);
        });
      }, 0);
    } else {
      // use canvg to convert svg to canvas
      const svg = nowOutputRef.current?.querySelector('.ve-editor');
      const url = await domtoimage.toPng(svg, { bgcolor: '#ddd' });
      const a = document.createElement('a');
      a.href = url;
      a.download = 'explain-graph.png';
      a.click();
    }

    trackEvent('console', 'export_graph_png');
  };

  const handleExplore = () => {
    if (
      data.tables.filter((item) => item._verticesParsedList || item._edgesParsedList || item._pathsParsedList).length >
      0
    ) {
      parseToGraph();
    } else {
      onResultConfig!({
        ...data,
        space,
        spaceVidType,
      });
    }
  };
  const handleRemoveMenu = () => {
    graph?.setPointer({
      showContextMenu: false,
    });
  };
  const parseToGraph = () => {
    const { vertexes, edges } = parseSubGraph(data.tables, spaceVidType);
    onExplorer!({
      space,
      vertexes,
      edges,
    });
  };

  const resultSuccess = code === 0;
  const items = useMemo(() => {
    const isDot = data.headers[0] === 'format';
    const isExplainRaw =
      gql
        ?.trim()
        .toLowerCase()
        .match(/^explain(\s+|\{)/) &&
      dataSource.length &&
      !isDot;
    const isProfileRaw =
      gql
        ?.trim()
        .toLowerCase()
        .match(/^profile(\s+|\{)/) &&
      dataSource.length &&
      !isDot;
    return [
      resultSuccess && {
        key: 'table',
        label: (
          <>
            <Icon type="icon-studio-console-table" />
            {intl.get('common.table')}
          </>
        ),
        children: (
          <Table
            bordered={true}
            columns={columns}
            dataSource={dataSource}
            pagination={{
              showTotal: () => `${intl.get('common.total')} ${dataSource.length}`,
            }}
            rowKey={() => uuidv4()}
          />
        ),
      },
      resultSuccess &&
        isExplainRaw && {
          key: 'explain',
          label: (
            <>
              <Icon type="icon-vesoft-sitemap-outline" />
              {intl.get('console.planTree')}
            </>
          ),
          children: (
            <Explain
              style={{ height: fullscreen ? window.innerHeight - 190 : 300 }}
              data={dataSource.map((item) => convertExplainData(item))}
            />
          ),
        },

      resultSuccess &&
        isProfileRaw && {
          key: 'profile',
          label: (
            <>
              <Icon type="icon-vesoft-sitemap-outline" />
              {intl.get('console.planTree')}
            </>
          ),
          children: (
            <Explain
              style={{ height: fullscreen ? window.innerHeight - 190 : 300 }}
              data={dataSource.map((item) => convertExplainData(item))}
            />
          ),
        },
      showGraph && {
        key: 'graph',
        label: (
          <>
            <Icon type="icon-studio-console-graph" />
            {intl.get('common.graph')}
          </>
        ),
        children: (
          <ForceGraph
            style={{
              height: fullscreen ? window.innerHeight - 190 : 300,
            }}
            space={space}
            data={dataSource}
            spaceVidType={spaceVidType}
            onGraphInit={setGraph}
          />
        ),
      },
      !resultSuccess && {
        key: 'log',
        label: (
          <>
            <Icon type="icon-studio-console-logs" />
            {intl.get('common.log')}
          </>
        ),
        children: <div className={styles.errContainer}>{message}</div>,
      },
    ].filter(Boolean);
  }, [gql, data, dataSource, columns, fullscreen]);
  const onFullScreen = () => {
    setFullscreen(!fullscreen);
  };
  return (
    <div className={styles.outputBox + ` ${fullscreen ? `${styles.fullscreen}` : ''}`} ref={nowOutputRef}>
      <div className={styles.outputHeader}>
        <p
          className={cls(styles.gql, { [styles.errorInfo]: !resultSuccess })}
          onClick={() => onHistoryItem(gql, space)}
        >
          <span className={styles.gqlValue}>
            {space ? `[${space}]>` : '$'} {gql}
          </span>
        </p>
        <div className={styles.outputOperations}>
          {templateRender?.(gql)}
          {!isFavorited ? (
            <Tooltip title={intl.get('console.addToFavorites')} placement="top">
              <Icon type="icon-studio-btn-save" onClick={addFavorites} />
            </Tooltip>
          ) : (
            <Tooltip title={intl.get('console.unfavorite')} placement="top">
              <Icon className={styles.btnYellow} type="icon-studio-btn-save-fill" onClick={removeFavorite} />
            </Tooltip>
          )}
          <Popover
            overlayClassName={styles.exportPopover}
            placement="bottom"
            content={
              <>
                <Button type="link" className={styles.downloadItem} onClick={downloadCsv}>
                  {intl.get('schema.csvDownload')}
                </Button>
                <Button disabled={tab === 'table'} type="link" className={styles.downloadItem} onClick={downloadPng}>
                  {intl.get('schema.pngDownload')}
                </Button>
              </>
            }
          >
            <Icon className={styles.btnExport} type="icon-studio-btn-output" />
          </Popover>
          <Icon type={visible ? 'icon-studio-btn-up' : 'icon-studio-btn-down'} onClick={() => setVisible(!visible)} />
          <Icon type="icon-studio-btn-close" onClick={handleItemRemove} />
        </div>
      </div>
      {visible && (
        <>
          <div className={styles.tabContainer}>
            <Tabs
              className={styles.outputTab}
              defaultActiveKey={'log'}
              size={'large'}
              tabPosition={'left'}
              onChange={handleTabChange}
              items={items}
            />
          </div>
          <div className={styles.outputFooter} onClick={handleRemoveMenu}>
            <span>
              {resultSuccess &&
                data.timeCost !== undefined &&
                `${intl.get('console.execTime')} ${data.timeCost / 1000000} (s)`}
            </span>
            <div className={styles.btns}>
              {onExplorer && !!space && (
                <Button className="primaryBtn" type="text" onClick={handleExplore}>
                  {intl.get('common.openInExplore')}
                </Button>
              )}
              <Icon
                type={fullscreen ? 'icon-vesoft-arrow-collapse-all' : 'icon-vesoft-arrow-expand-all'}
                onClick={onFullScreen}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default observer(OutputBox);
