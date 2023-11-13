export default {
  common: {
    requestError: '请求错误',
    currentSpace: '当前图空间',
    seeTheHistory: '查看历史',
    table: '表格',
    log: '日志',
    sorryNGQLCannotBeEmpty: 'nGQL语句不能为空',
    disablesUseToSwitchSpace: '禁止使用命令切换Space',
    NGQLHistoryList: 'nGQL历史列表',
    empty: '清空',
    run: '运行',
    console: '控制台',
    ok: '确认',
    success: '成功',
    fail: '失败',
    cancel: '取消',
    confirm: '确认',
    import: '导入',
    ask: '确定进行当前操作？',
    openInExplore: '导入图探索',
    schema: 'Schema',
    create: '创建',
    name: '名称',
    operation: '操作',
    delete: '删除',
    optional: '可选',
    exportNGQL: '对应的nGQL语句',
    relatedProperties: '相关属性',
    type: '类型',
    edit: '编辑',
    deleteSuccess: '删除成功',
    propertyName: '属性名称',
    dataType: '数据类型',
    allowNull: '允许空值',
    defaults: '默认值',
    addProperty: '添加属性',
    updateSuccess: '更新成功',
    add: '添加',
    tag: '标签',
    edge: '边类型',
    index: '索引',
    yes: '确定',
    no: '取消',
    graph: '可视化',
    color: '颜色',
    total: '共计',
    namePlaceholder: '请输入{name}名',
    comment: '描述',
    space: '图空间',
    version: '版本',
    statistics: '统计',
    duplicate: '复制',
    copy: '复制',
    copySuccess: '复制成功',
    sketch: 'Schema 草图',
    viewSchema: '查看 Schema',
    beta: 'Beta',
    danglingEdge: '悬挂边',
    columnName: '列名',
    src: '起点',
    dst: '终点',
    value: '值',
    continue: '继续',
    update: '更新',
    prev: '上一步',
    createTime: '创建时间',
    rerun: '重新导入',
  },
  doc: {
    welcome: '欢迎使用',
    functionIntro: '功能介绍',
    schemaIntro: `您可以在 schema 模块对 ${window.gConfig.databaseName} 图空间进行管理。`,
    importIntro: `您可以使用导入模块将数据批量导入 ${window.gConfig.databaseName}。`,
    consoleIntro: `您可以使用控制台模块对 ${window.gConfig.databaseName} 内的数据进行查询操作。`,
    learningDoc: '学习文档',
    getStarted: `认识 ${window.gConfig.databaseName} Studio`,
    getStartedTip: `什么是 ${window.gConfig.databaseName} Studio。`,
    useGuide: `${window.gConfig.databaseName} Studio 使用手册`,
    useGuideTip: `学习如何使用 ${window.gConfig.databaseName} Studio。`,
    ngqlIntro: `${window.gConfig.databaseName} 查询语言 (nGQL)`,
    ngqlIntroTip: `nGQL 是 ${window.gConfig.databaseName} 使用的的声明式图查询语言，是为开发和运维人员设计的类 SQL 查询语言，易于学习。`,
    start: '快速开始',
    sketchIntro: '您可以在画板上自行设计 Schema，直观展示点边关系。',
    basketballplayerIntro: '最简单的示例图谱空间，最广泛被文档中引用的数据集',
    snsIntro: '社交网络示例图谱空间，包含用户、好友、帖子、评论等数据，新好友推荐、时间线生成、社交分析',
    movieIntro: '电影推荐图谱，尝试在图上做 CBF、ItemCF 和 UserCF 算法',
    datalineageIntro: '元数据管理实例数据集，血缘查询、血缘依赖分析、大数据治理',
    idMappingIntro: 'ID Mapping，用户系统上的实体分析案例',
    fifa2022Intro: '面向关系而非复杂属性的世界杯图谱，尝试利用图算法预测冠军吧（假设我们还不知道冠军）',
    shareholdingIntro: '股权关系图谱，图上实做股权穿透、公司实控人分析、背景调查',
    openstackIntro: '图驱动的复杂基础设施智能运维实操，基于 OpenStack 全资源抓取图谱的例子',
    fraudDetectionIntro: '欺诈检测的图应用，以借贷场景为例',
    supplychainIntro: '供应链图谱，以汽车制造为例。',
  },
  warning: {
    connectError: '数据库连接有误，请重新配置',
    crashPage: '页面崩溃了',
    crashPageTip: '服务崩溃，请联系管理员',
    refreshPage: '刷新页面',
    contactStaff: '联系客服',
    errorMessage: '错误信息',
  },
  configServer: {
    connect: '连接',
    host: 'Graphd IP 地址',
    port: 'Port',
    username: '用户名',
    password: '密码',
    clear: '登出',
    title: '配置数据库',
    tip: '连接数据库说明文档->',
  },
  formRules: {
    hostRequired: '请填写数据库服务器的IP地址',
    portRequired: '请填写数据库服务器的端口',
    usernameRequired: '请填写用户名',
    passwordRequired: '请填写密码',
    positiveIntegerRequired: '请输入一个非负整数',
    nameValidate: '命名必须以字母开头，且只支持输入英文字母、数字以及下划线_',
    nameRequired: '请输入名称',
    numberRequired: '请输入正整数',
    replicaLimit: '副本数量不得超过你当前 online 机器数量({number})',
    ttlRequired: '请选择TTL指定的属性, 且属性的数据类型需为 integer 或 timestamp',
    ttlDurationRequired: '请输入时间(s)',
    dataTypeRequired: '请选择数据类型',
    edgeTypeRequired: '请选择边类型',
    srcIdRequired: '请选择起点 VID',
    dstIdRequired: '请选择终点 VID',
    vidRequired: '请选择 VID',
    vidTypeRequired: '请选择 VID 类型',
    fixStringLengthRequired: '请输入字符串固定长度',
    spaceRequired: '图空间不能为空',
    maxBytes: '不能超过 {max} 字节',
    ttlLimit: '属性的数据类型必须是int或者timestamp',
    associateNameRequired: '请选择关联 {type} 名称',
    fileRequired: '请选择文件',
    formHostRequired: '请填写服务器IP地址',
    formPortRequired: '请填写服务器端口',
    regionRequired: '请选择区域',
    endpointRequired: '请填写 Endpoint',
    bucketRequired: '请填写 Bucket',
    accessKeyIdRequired: '请填写 Access Key ID',
    accessKeySecretRequired: '请填写 Access Key Secret',
    platformRequired: '请选择平台',
  },
  console: {
    execTime: '执行时间消耗',
    exportVertex: '请选择表中代表点VID的列',
    exportEdge: '请选择结果中分别代表边的起点（src_vid）、终点（dst_vid）和权重（rank）的列',
    deleteHistory: '清除历史',
    cypherParam: '自定义参数',
    favorites: '收藏夹',
    addToFavorites: '添加到收藏夹',
    unfavorite: '取消收藏',
    clearFavorites: '清空收藏夹',
    selectSpace: '请选择图空间',
    planTree: '执行计划',
  },
  explore: {
    vertexStyle: '节点颜色',
    notExist: '不存在',
    expandItem: '展开',
    collapseItem: '收起',
  },
  import: {
    uploadFile: '上传文件',
    dataSourceManagement: '数据源管理',
    importData: '导入数据',
    createTask: '创建导入任务',
    uploadTemp: '导入模板',
    downloadConfig: '下载配置文件',
    downloadLog: '下载日志',
    viewLogs: '查看日志',
    details: '详情',
    task: '导入任务',
    taskList: '任务列表',
    taskName: '任务名称',
    tag: '关联标签',
    edge: '关联边',
    runImport: '导入',
    fileName: '文件名',
    withHeader: '表头',
    fileSize: '大小',
    fileTitle: '文件列表',
    bindDatasource: '添加导入文件',
    endImport: '终止导入',
    prop: '属性',
    mapping: '对应列标',
    edgeText: '边',
    choose: '选择',
    ignore: '忽略',
    vertexText: '点',
    indexNotEmpty: '对应列标不能为空',
    enterPassword: '请输入 database 账号密码以继续',
    isEmpty: '为空',
    startImporting: '开始导入',
    stopImportingSuccess: '已停止导入',
    deleteSuccess: '已删除任务记录',
    batchSize: '批处理量',
    importCompleted: '导入完成',
    importStopped: '导入中止',
    importFailed: '导入失败',
    importRunning: '导入中',
    importPending: '等待导入',
    notImported: '{total}条记录未导入',
    selectFile: '选择绑定文件',
    addTag: '添加 Tag',
    addEdge: '添加 Edge Type',
    selectTag: '选择 Tag',
    selectEdge: '选择 Edge 类型',
    config: '任务配置',
    parseFailed: '文件解析失败',
    uploadTemplate: '将 YAML 配置文件拖放到该区域',
    uploadBoxTip: '使用 YAML 配置文件用来描述待导入文件信息、数据库服务器等信息。',
    fileUploadRequired: '1. 请确保在导入 YAML 文件之前上传所有 CSV 数据文件。 如果没有，请先前往',
    fileUploadRequired2: '数据文件',
    exampleDownload: '2. 配置文件示例:',
    uploadTemplateTip:
      '3. 配置Yaml文件：模板中所有文件路径（path、logPath）请只保留文件名（保留文件扩展名），例如： 日志路径：config.csv',
    reUpload: '重新上传',
    fileNotExist: '文件 {name} 不存在',
    importYaml: '导入 YAML 文件',
    templateMatchError: '配置中的用户姓名与当前登录账号不一致',
    uploadSuccessfully: '上传文件成功',
    fileSizeLimit: '{name}文件过大，超过上传限制({size})，请将文件通过 scp 的方式上传到安装目录下的 data/upload 目录',
    noHttp: '配置文件中的 address 不支持携带 http 协议，请去除 http(s)://',
    addressMatch: '配置文件中的 address 字段必须包含当前登录的 Graph 地址。多个地址用“,”隔开。',
    dataSourceFile: '文件源',
    vidColumn: 'VID 列',
    srcVidColumn: '起点 VID 列',
    dstVidColumn: '终点 VID 列',
    vidFunction: 'VID 函数',
    vidPrefix: 'VID 前缀',
    vidSuffix: 'VID 后缀',
    concurrencyTip: `${window.gConfig.databaseName} 客户端并发数`,
    batchSizeTip: '单批次插入数据的语句数量',
    retryTip: 'nGQL 语句执行失败的重试次数',
    vidFunctionTip: '生成 VID 的函数。目前只支持 hash 函数',
    vidPrefixTip: '给原始 VID 添加的前缀',
    vidSuffixTip: '给原始 VID 添加的后缀',
    selectCsvColumn: '选择 CSV 列',
    graphAddress: 'Graph 服务地址',
    concurrency: '并发数',
    retry: '重试次数',
    graphAddressTip: 'Graph 服务的地址和端口。将使用以下 Graph 节点进行数据导入',
    currentHost: '当前登录的 Graph 节点',
    expandMoreConfig: '展开更多配置',
    pickUpConfig: '收起配置',
    tagRequired: '请添加标签',
    edgeRequired: '请添加边类型',
    tagFileRequired: '请添加标签导入文件源',
    edgeFileRequired: '请添加边类型导入文件源',
    tagFileSelect: '请选择标签导入文件源',
    edgeFileSelect: '请选择边类型导入文件源',
    configDisplay: '配置展示',
    loadToTag: '导入文件 {file} 到标签 {name}',
    loadToEdge: '导入文件 {file} 到边类型 {name}',
    importConfirm: '导入任务确认',
    delimiter: '分隔符',
    previewFiles: '上传文件预览',
    sampleData: '示例数据',
    hasHeader: '携带表头',
    noHeader: '无表头',
    enterDelimiter: '请输入分隔符',
    applicateToAll: '应用到所有文件',
    deleteFiles: '删除选中文件',
    fileRepeatTip: '上述文件已存在，继续上传将覆盖原文件',
    filePreview: '预览文件 {name}',
    uploadConfirm: '上传文件确认',
    localFiles: '本地文件',
    s3: '云存储',
    sftp: 'SFTP',
    newDataSource: '新建数据源',
    editDataSource: '编辑数据源',
    deleteDataSource: '删除数据源',
    datasourceList: '{type}列表',
    ipAddress: 'IP 地址：端口',
    bucketName: 'Bucket 名称',
    accessKeyId: 'AccessKeyId',
    region: '区域',
    createTime: '添加日期',
    account: '账号',
    endpoint: 'Endpoint',
    accessKeySecret: 'AccessKeySecret',
    dataSourceType: '数据源类型',
    selectPlatform: '选择平台',
    enterAddress: '请输入终端节点地址',
    enterRegion: '请输入区域',
    serverAddress: '服务器地址',
    port: '端口',
    newDataSourceTip: '请先添加数据源',
    addNewImport: '添加导入任务',
    addNewImportTip: '添加数据源后，创建导入任务将数据导入数据库',
    start: '开始',
    s3Tip: '只支持兼容Amazon S3接口的云服务',
    readerConcurrency: '读取并发数',
    readerConcurrencyTip: '读取文件的并发数',
    importerConcurrency: '导入并发数',
    importerConcurrencyTip: '导入数据的并发数',
    selectDatasourceFile: '选择数据源文件',
    datasourceType: '数据源类型',
    filePath: '文件路径',
    directory: '目录',
    preview: '预览',
    customize: '自定义',
    s3Platform: 'S3 服务提供商',
    endpointTip: '请使用域名中不含 bucket 名称的节点，例如 {sample}',
    awsTip: 'https://s3.us-east-2.amazonaws.com',
    ossTip: 'https://oss-cn-hangzhou.aliyuncs.com',
    cosTip: 'https://cos.ap-shanghai.myqcloud.com',
    customizeTip: 'http://127.0.0.1:9000',
    addressRequired: '请在配置文件中输入导入地址',
    usernameRequired: '请在配置文件中输入用户名',
    passwordRequired: '请在配置文件中输入密码',
    s3AccessKeyRequired: '请在配置文件中输入 s3 的 accessKeyID',
    s3SecretKeyRequired: '请在配置文件中输入 s3 的 accessKeySecret',
    sftpUsernameRequired: '请在配置文件中输入 sftp 的用户名',
    sftpPasswordRequired: '请在配置文件中输入 sftp 的密码',
    ossAccessKeyRequired: '请在配置文件中输入 oss 的 accessKeyID',
    ossSecretKeyRequired: '请在配置文件中输入 oss 的 accessKeySecret',
    draft: '草稿',
    saveDraft: '保存草稿',
    modifyTime: '编辑时间',
    taskNameRequired: '请填写任务名称并选择图空间',
    fileMissing: '{files} 文件不存在，请重新上传文件或添加相关数据源',
    datasourceMissing: '{files} 所在数据源未找到，请重新添加相关数据源并重新配置任务',
    templateRerunTip: '模板导入生成的任务不支持编辑，请直接修改模板文件并导入',
    rerunError: '找不到任务配置记录，无法重跑任务',
    editTaskError: '找不到任务配置记录，无法继续编辑',
    s3SafetyTip: '出于数据安全考虑，建议 Bucket 中仅放和数据导入相关的文件，且 Bucket 设置为只读。',
  },
  schema: {
    spaceList: '图空间列表',
    useSpaceErrTip:
      '图空间未找到。立刻尝试使用刚创建的图空间可能会失败，因为创建是异步实现的。为确保数据同步，后续操作能顺利进行，请等待 2 个心跳周期（20 秒）。',
    createSuccess: '创建成功',
    defineFields: '定义属性',
    uniqProperty: '属性名称不允许重名',
    cancelOperation: '是否取消配置并关闭面板',
    cancelPropmt: '关闭面板将删除所有属性，是否继续？',
    fieldDisabled: '该属性被 ttl_col 引用，不支持更改操作，如要更改，请先更新 ttl',
    indexExist: '已拥有索引，无法同时配置 TTL',
    indexType: '索引类型',
    indexName: '索引名称',
    indexFields: '索引属性',
    associateName: '关联 {type} 名称',
    dragSorting: '(可拖拽排序)',
    selectFields: '请选择关联的属性',
    indexedLength: '请输入索引长度',
    indexedLengthDescription: '设置索引字符串的长度。如果索引定长字符串，则索引长度无法修改。',
    indexedLengthRequired: '索引长度应为正整数',
    rebuild: '重建索引',
    createSpace: '创建图空间',
    No: '序号',
    spaceName: '名称',
    partitionNumber: 'Partition Number',
    replicaFactor: 'Replica Factor',
    charset: 'Charset',
    collate: 'Collate',
    vidType: 'Vid Type',
    group: 'Group',
    comment: 'Comment',
    operations: '操作',
    spaceNameEnter: '请输入图空间名称',
    propertyCount: '属性数量',
    configTypeList: '{type}列表',
    configTypeAction: '{action}{type}',
    timestampFormat:
      "时间类型支持插入方式: <br />1. 调用函数 now()  <br />2. 调用函数 timestamp()，例如：timestamp('2021-07-05T06:18:43.984000')  <br />3. 直接输入时间戳，即从 1970-01-01 00:00:00 开始的秒数",
    dateFormat: "日期类型支持插入方式: <br /> 调用函数 date()，例如：date('2021-03-17')",
    timeFormat: "时间类型支持插入方式: <br /> 调用函数 time()，例如time('17:53:59')",
    datetimeFormat: "日期时间类型支持插入方式: <br /> 调用函数 datetime()，例如：datetime('2021-03-17T17:53:59')",
    geographyFormat: "geo 类型支持插入方式: <br /> 调用函数 ST_GeogFromText()，例如：ST_GeogFromText('POINT(6 10)')",
    'geography(point)Format':
      "geo(point) 类型支持插入方式: <br /> 调用函数 ST_GeogFromText('POINT()')，例如：ST_GeogFromText('POINT(6 10)')",
    'geography(linestring)Format':
      "geo(linestring) 类型支持插入方式: <br /> 调用函数 ST_GeogFromText('LINESTRING()')，例如：ST_GeogFromText('LINESTRING(3 4,10 50,20 25)')",
    'geography(polygon)Format':
      "geo(polygon) 类型支持插入方式: <br /> 调用函数 ST_GeogFromText('POLYGON()')，例如：ST_GeogFromText('POLYGON((1 1,5 1,5 5,1 5,1 1),(2 2,2 3,3 3,3 2,2 2))')",
    durationFormat:
      'duration 类型支持插入方式: <br /> 调用函数 duration(<map>)，例如：duration({years: 1, seconds: 0})',
    setTTL: '设置TTL（存活时间）',
    refresh: '更新',
    startStat: '开始统计',
    statTip: '统计执行时间受数据量影响。',
    lastRefreshTime: '上次更新时间',
    statsType: '维度',
    statsName: '名称',
    statsCount: '数量',
    statError: '统计失败，请重试',
    statFinished: '统计结束',
    deleteSpace: '删除图空间',
    clearSpace: '清空图空间',
    cloneSpace: '克隆图空间',
    length: '长度',
    selectVidTypeTip: '选择 Vid 类型',
    csvDownload: '导出 CSV',
    pngDownload: ' 导出 PNG',
    rebuildSuccess: '{names}重建完成',
    rebuildFailed: '{names}重建失败',
    startRebuildIndex: '开始重建索引{name}',
    getSchema: '获取 Schema',
    getSchemaTip: `因为当前 ${window.gConfig.databaseName} 版本下不存在点边的强绑定关系，结果将依据随机捞取到的数据生成，仅供参考。`,
    danglingEdge: '悬挂边',
    showDDL: '查看 Schema DDL',
    downloadNGQL: '下载 .NGQL 文件',
    getDDLError: '获取 Schema DDL 失败, 请重试',
    totalVertices: '总计点数量',
    totalEdges: '总计边数量',
  },
  empty: {
    stats: '暂无统计数据',
    statsTip: '请点击按钮开始统计',
    tag: '暂无标签数据',
    tagTip: '请点击按钮创建标签',
    edge: '暂无边类型数据',
    edgeTip: '请点击按钮创建边类型',
    index: '暂无索引数据',
    indexTip: '请点击按钮创建索引',
  },
  menu: {
    use: '使用手册',
    release: '更新日志',
    forum: '求助论坛',
    nGql: 'nGQL',
    feedback: '问题反馈',
    repo: 'GitHub项目',
    trial: '企业版试用',
    contact: '联系我们',
  },
  link: {
    nGQLHref: 'https://docs.nebula-graph.com.cn/3.6.0/3.ngql-guide/1.nGQL-overview/1.overview/',
    mannualHref: 'https://docs.nebula-graph.com.cn/3.6.0/nebula-studio/about-studio/st-ug-what-is-graph-studio/',
    startStudioHref: 'https://docs.nebula-graph.com.cn/3.6.0/nebula-studio/quick-start/st-ug-plan-schema/',
    versionLogHref: 'https://docs.nebula-graph.com.cn/3.6.0/20.appendix/release-notes/studio-release-note/',
    forumHref: 'https://discuss.nebula-graph.com.cn/',
    feedback: 'https://discuss.nebula-graph.com.cn/tag/nebula-studio',
    trial: 'https://wj.qq.com/s2/10158890/69a8',
    contact: 'https://www.nebula-graph.com.cn/contact',
    loginHref: 'https://docs.nebula-graph.com.cn/3.6.0/nebula-studio/deploy-connect/st-ug-connect/',
  },
  sketch: {
    dragTip: '拖放到画布上',
    tag: '标签',
    edge: '边类型',
    name: '{name}名称',
    detail: '{name}详情',
    comment: '描述',
    properties: '属性',
    propertyName: '属性名称',
    dataType: '数据类型',
    addProperty: '添加属性',
    type: '类型',
    list: '草图列表',
    new: '新建',
    applyToSpace: '应用到图空间',
    createSpace: '创建图空间',
    selectSpace: '选择图空间',
    noCurrentSketch: '当前没有选中草图',
    noCurrentSketchTips: '请在左侧列表中选择草图',
    sketchInvalid: '请完善当前 Schema 信息。',
    saveSuccess: '保存成功',
    saveReminder: '当前草图有修改未保存，是否继续切换草图?',
    saveTip: '当前草图有修改未保存， 请先保存。',
    confirmDelete: '请确认是否删除',
    saveDraft: '保存草稿',
    export: '导出',
    applySpaceTip: '新的 schema 不会覆盖图空间中已有的 schema 信息',
    sameSchemaWarning: '图空间中已存在{content}，请修改{hasType}名称，或者选择其他图空间。',
    noData: '暂无数据，请先导入数据',
    uniqName: '标签和边类型名称不允许重名',
    spaceExisted: '图空间已存在',
    updateNameSuccess: '更新名称成功',
    search: '搜索草图名称',
  },
  welcome: {
    doc: '文档',
    guide: '新手引导',
    quickStart: '开始',
    quickStartDesc: '文档',
    demos: '示例',
    starterDatasets: '入门数据集',
    solutionDatasets: '行业数据集',
    demoDownload: '下载',
    demoDownloading: '下载中',
    demoIntro: 'Demo 介绍',
    loadWaiting: '数据加载中，请稍等...预计将在 {second}s 后结束',
    downloadSuccess: '数据集 `{space}` 下载成功',
    spaceExist: '图空间 `{space}` 已存在',
    schemaModuleLink: 'https://docs.nebula-graph.com.cn/3.6.0/nebula-studio/quick-start/st-ug-create-schema/',
    importModuleLink: 'https://docs.nebula-graph.com.cn/3.6.0/nebula-studio/quick-start/st-ug-import-data/',
    consoleModuleLink: 'https://docs.nebula-graph.com.cn/3.6.0/nebula-studio/quick-start/st-ug-console/',
    sketchModuleLink: 'https://docs.nebula-graph.com.cn/3.6.0/nebula-studio/quick-start/draft/',
    basketballplayerDocLink: 'https://nebula-graph.com.cn/posts/playground-basketball-player',
    shareholdingDocLink: 'https://nebula-graph.com.cn/demo/shared-holding',
    openstackDocLink: 'https://www.siwei.io/graph-enabled-infra-ops',
    snsDocLink: 'https://www.siwei.io/nebulagraph-sns/',
    supplychainDocLink: 'https://github.com/wey-gu/supplychain-dataset-gen',
    datalineageDocLink: 'https://www.siwei.io/data-lineage-oss-ref-solution/',
    movieDocLink: 'https://www.siwei.io/recommendation-system-with-graphdb/',
    idMappingDocLink: 'https://www.siwei.io/identity-resolution/',
    fraudDetectionDocLink: 'https://www.siwei.io/fraud-detection-with-nebulagraph/',
    fifa2022DocLink: 'https://www.siwei.io/chatgpt-and-nebulagraph-predict-fifa-world-cup/',
    alwaysShow: '始终展示欢迎页',
    progressTitle: '下载 & 导入数据',
  },
};
