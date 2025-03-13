class StationX {
	#NAMESPACE;
	#DEFAULT_LANGUAGE;
	#CURRENT_LANGUAGE;
	#AVAILABLE_LANGUAGES;
	#portalURL;
	#contextPath;
	#spritemapPath;
	#portletId;
	#imagePath;
	#plid;
	#baseRenderURL;
	#baseActionURL;
	#baseResourceURL;
	#params;

	set NAMESPACE(namespace) {
		this.#NAMESPACE = namespace;
	}
	get NAMESPACE() {
		return this.#NAMESPACE;
	}
	set DEFAULT_LANGUAGE(lang) {
		this.#DEFAULT_LANGUAGE = lang;
	}
	get DEFAULT_LANGUAGE() {
		return this.#DEFAULT_LANGUAGE;
	}
	set CURRENT_LANGUAGE(lang) {
		this.#CURRENT_LANGUAGE = lang;
	}
	get CURRENT_LANGUAGE() {
		return this.#CURRENT_LANGUAGE;
	}
	set AVAILABLE_LANGUAGES(lang) {
		this.#AVAILABLE_LANGUAGES = lang;
	}
	get AVAILABLE_LANGUAGES() {
		return this.#AVAILABLE_LANGUAGES;
	}
	set portalURL(url) {
		this.#portalURL = url;
	}
	get portalURL() {
		return this.#portalURL;
	}
	set contextPath(path) {
		this.#contextPath = path;
	}
	get contextPath() {
		return this.#contextPath;
	}
	set spritemapPath(path) {
		this.#spritemapPath = path;
	}
	get spritemapPath() {
		return this.#spritemapPath;
	}
	set portletId(id) {
		this.#portletId = id;
	}
	get portletId() {
		return this.#portletId;
	}
	set imagePath(path) {
		this.#imagePath = path;
	}
	get imagePath() {
		return this.#imagePath;
	}
	set plid(plid) {
		this.#plid = plid;
	}
	get plid() {
		return this.#plid;
	}
	set baseRenderURL(url) {
		this.#baseRenderURL = url;
	}
	get baseRenderURL() {
		return this.#baseRenderURL;
	}
	set baseActionURL(url) {
		this.#baseActionURL = url;
	}
	get baseActionURL() {
		return this.#baseActionURL;
	}
	set baseResourceURL(url) {
		this.#baseResourceURL = url;
	}
	get baseResourceURL() {
		return this.#baseResourceURL;
	}
	set params(params) {
		this.#params = params;
	}
	get params() {
		return this.#params;
	}

	Debug = {
		eventTrace: function (message, event, dataPacket) {
			console.log('/+++++++++' + message + '++++++++/');
			console.log(event);
			console.log(dataPacket);
			console.log('/++++++++++++++++++++++++++/');
		}
	};

	constructor(
		NAMESPACE,
		DEFAULT_LANGUAGE,
		CURRENT_LANGUAGE,
		AVAILABLE_LANGUAGES,
		portalURL,
		contextPath,
		spritemapPath,
		portletId,
		imagePath,
		plid,
		baseRenderURL,
		baseActionURL,
		baseResourceURL,
		params
	) {
		this.#NAMESPACE = NAMESPACE;
		this.#DEFAULT_LANGUAGE = DEFAULT_LANGUAGE;
		this.#CURRENT_LANGUAGE = CURRENT_LANGUAGE;
		this.#AVAILABLE_LANGUAGES = AVAILABLE_LANGUAGES.split(',');
		this.#portalURL = portalURL;
		this.#contextPath = contextPath;
		this.#spritemapPath = spritemapPath;
		this.#portletId = portletId;
		this.#imagePath = imagePath;
		this.#plid = plid;
		this.#baseRenderURL = baseRenderURL;
		this.#baseActionURL = baseActionURL;
		this.#baseResourceURL = baseResourceURL;
		this.#params = params;
	}

	namespace(param) {
		return this.NAMESPACE + param;
	}

	ns(params) {
		let nsParams = new Object();

		for (const key in params) {
			nsParams[this.NAMESPACE + key] = params[key];
		}

		console.log('nsParams: ', params, nsParams);
		return nsParams;
	}

	static EditStatus = {
		UPDATE: 'update',
		ADD: 'add'
	};

	static LiferayProperty = {
		COMPANY_ID: 'companyId',
		GROUP_ID: 'groupId',
		USER_ID: 'userId',
		USER_NAME: 'userName',
		CREATE_DATE: 'createDate',
		MODIFIED_DATE: 'modifiedDate',
		LAST_PUBLISHED_DATE: 'lastPublishedDate',
		STATUS: 'status',
		STATUS_BY_USER_ID: 'statusByUserId',
		STATUS_BY_USER_NAME: 'statusByUserName',
		STATUS_DATE: 'statusDate'
	};

	static DataTypeProperty = {
		ID: 'dataTypeId',
		NAME: 'dataTypeName',
		VERSION: 'dataTypeVersion',
		EXTENSION: 'extension',
		DISPLAY_NAME: 'displayName',
		DESCRIPTION: 'description',
		VISUALIZERS: 'visualizers',
		TOOLTIP: 'tooltip',
		HAS_STRUCTURE: 'hasDataStructure'
	};

	static Validator = {
		dataTypeName: (name) => {
			const regexp = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
			return regexp.test(name);
		},
		version: (ver) => {
			return /^\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ver);
		},
		extension: (ext) => {
			return /^[a-zA-Z0-9]{1,12}$/.test(ext);
		},
		integer: (num, positive = 0) => {
			if (positive > 0) {
				return /^[+]?\d+$/.test(num);
			} else if (positive < 0) {
				return /^-\d+$/.test(num);
			} else {
				return /^-?\d+$/.test(num);
			}
		}
	};

	static ValidationRule = {
		VARIABLE: new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$'),
		VERSION: new RegExp('^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}$'),
		EXTENSION: new RegExp('^[a-zA-Z0-9]{1,12}$'),
		INTEGER: new RegExp('^-?d+$'),
		INT_POSITIVE: new RegExp('^[+]?d+$'),
		INT_NEGATIVE: new RegExp('^-d+$')
	};

	createDataType(jsonObj) {
		return {
			...jsonObj
		};
	}

	redirect(baseURL, params) {
		let renderURL = Liferay.Util.PortletURL.createRenderURL(
			baseURL,
			params
		);

		console.log('renderURL: ', renderURL.toString());

		window.location.href = renderURL.toString();
	}

	ajax(resourceId, type, dataType, params, successFunc, errorFunc) {
		let self = this;
		AUI().use('aui-base, portlet-url', function (A) {
			let resourceURL = Liferay.PortletURL.createURL(
				self.baseResourceURL
			);
			resourceURL.setResourceId(resourceId);

			$.ajax({
				type: type,
				url: resourceURL,
				dataType: dataType,
				data: self.ns(params),
				success: (data) => {
					successFunc(data);
				},
				error: (a, b, c, d) => {
					errorFunc(a, b, c, d);
				}
			});
		});
	}

	static ACTION_NAME = 'javax.portlet.action';

	static RenderCommandNames = {
		ROOTL: '/',

		DATATYPE_EXPLORER: '/jsp/DTExplorer/datatype-explorer',
		DATATYPE_EDITOR: '/jsp/DTExplorer/datatype-editor',
		SEARCH_DATATYPES: '/jsp/DTExplorer/search-datatypes',
		EDIT_DATATYPE: '/jsp/DTExplorer/edit-datatype',
		DATATYPE_VIEWER: '/jsp/DTViewer/datatype-viewer',
		STRUCTURED_DATA_EXPLORER: '/jsp/SDExplorer/structured-data-explorer',
		STRUCTURED_DATA_ADVANCED_SEARCH:
			'/jsp/SDExplorer/structured-data-advanced-search',
		SEARCH_STRUCTURED_DATA: '/jsp/SDExplorer/search-structured-data',
		STRUCTURED_DATA_EDITOR: '/jsp/SDEditor/structured-data-editor',
		STRUCTURED_DATA_VIEWER: '/jsp/SDViewer/structured-data-viewer'
	};

	static PortletKeys = {
		DATA_WORKBENCH: 'com_sx_icecap_web_portlet_DataWorkbenchPortlet',
		DATATYPE_EXPLORER: 'com_sx_icecap_web_portlet_DataTypeExplorerPortlet',
		DATATYPE_EDITOR: 'com_sx_icecap_web_portlet_DataTypeEditorPortlet',
		DATATYPE_VIEWER: 'com_sx_icecap_web_portlet_DataTypeViewerPortlet',
		DATA_STRUCTURE_BUILDER:
			'com_sx_icecap_web_portlet_DataStructureBuilderPortlet',
		STRUCTURED_DATA_VIEWER:
			'com_sx_icecap_web_portlet_StructuredDataViewerPortlet',
		STRUCTURED_DATA_EDITOR:
			'com_sx_icecap_web_portlet_StructuredDataEditorPortlet',
		STRUCTURED_DATA_EXPLORER:
			'com_sx_icecap_web_portlet_StructuredDataExplorerPortlet'
	};

	static ActionNames = {
		COPY_DATATYPE: '/action/DTExplorer/copy-datatype',
		DELETE_DATATYPE: '/action/DTExplorer/delete-datatype',
		ADD_DATATYPE: '/action/DTEditor/add-datatype',
		UPDATE_DATATYPE: '/action/DTEditor/update-datatype',
		DELETE_DATA_STRUCTURE: '/action/DTEditor/delete-data-structure',
		STRUCTURED_DATA_ADVANCED_SEARCH:
			'/action/SDExplorer/sd-advanced-search',
		DELETE_STRUCTURED_DATA: '/action/SDExplorer/delete-structured-data',
		ADD_STRUCTURED_DATA: '/action/SDEditor/add-structured-data',
		UPDATE_STRUCTURED_DATA: '/action/SDEditor/update-structured-data',
		PUBLISH_STRUCTURED_DATA: '/action/SDEditor/publish-structured-data'
	};

	static ParamProperty = {
		ABSTRACT_KEY: 'abstractKey',
		ACTIVE: 'active',
		ALLOWED_EXTENSIONS: 'allowedExtensions',
		AVAILABLE_LANGUAGE_IDS: 'availableLanguageIds',
		COLUMNS: 'columns',
		COLUMN_WIDTH: 'columnWidth',
		COUNTRY_CODE: 'countryCode',
		CSS_WIDTH: 'cssWidth',
		CSS_CUSTOM: 'cssCustom',
		DEFINITION: 'definition',
		DEFAULT_LANGUAGE_ID: 'defaultLanguageId',
		DEFAULT_LOCALE: 'defaultLocale',
		DIMENSION_X: 'dimensionX',
		DIMENSION_Y: 'dimensionY',
		DISABLED: 'disabled',
		DISPLAY_NAME: 'displayName',
		DISPLAY_STYLE: 'displayStyle',
		DOWNLOADABLE: 'downloadable',
		ELEMENT_TYPE: 'elementType',
		ENABLE_TIME: 'enableTime',
		END_YEAR: 'endYear',
		EXPANDED: 'expanded',
		FALSE_LABEL: 'falseLabel',
		FILE_ID: 'fileId',
		FORMAT: 'format',
		GRID_COLUMNS: 'gridColumns',
		ID: 'id',
		INPUT_SIZE: 'inputSize',
		ITEM_DISPLAY_NAME: 'itemDisplayName',
		LINE_BREAK: 'lineBreak',
		LIST_ITEM: 'listItem',
		LIST_ITEM_VALUE: 'listItemValue',
		LIST_ITEMS: 'listItems',
		MANDATORY: 'mandatory',
		MASTER_TERM: 'masterTerm',
		MAX_BOUNDARY: 'maxBoundary',
		MAX_LENGTH: 'maxLength',
		MAX_VALUE: 'maxValue',
		MIN_BOUNDARY: 'minBoundary',
		MIN_LENGTH: 'minLength',
		MIN_VALUE: 'minValue',
		MULTIPLE: 'multiple',
		MULTIPLE_LINE: 'multipleLine',
		NAME: 'name',
		NUMERIC_PLACE_HOLDER: 'numericPlaceHolder',
		OPTION_LABEL: 'optionLabel',
		OPTION_VALUE: 'optionValue',
		OPTIONS: 'options',
		OPTION_SELECTED: 'optionSelected',
		ORDER: 'order',
		PATH: 'path',
		PATH_TYPE: 'pathType',
		PLACE_HOLDER: 'placeHolder',
		RANGE: 'range',
		REF_DATATYPES: 'refDataTypes',
		REF_DATABASES: 'refDatabases',
		ROWS: 'rows',
		SEARCHABLE: 'searchable',
		SLAVE_TERMS: 'slaveTerms',
		START_YEAR: 'startYear',
		SWEEPABLE: 'sweepable',
		SYNONYMS: 'synonyms',
		TEXT: 'text',
		TOOLTIP: 'tooltip',
		TRUE_LABEL: 'trueLabel',
		TYPE: 'type',
		UNCERTAINTY: 'uncertainty',
		UNCERTAINTY_VALUE: 'uncertaintyValue',
		UNIT: 'unit',
		URI: 'uri',
		URI_TYPE: 'uriType',
		URL: 'url',
		VALIDATION_RULE: 'validationRule',
		VALUE: 'value',
		VALUE_DELIMITER: 'valueDelimiter',
		VERSION: 'version'
	};

	static WebKeys = {
		PORTLET_NAME: 'portletName'
	};

	webKey(key) {
		return this.NAMESPACE + key;
	}

	static DisplayType = {
		NORMAL: 'normal',
		INLINE: 'inline',
		INLINE_NO_SPACE: 'inlineNonSpace',
		FLAT: 'flat',
		INLINE_FLAT: 'inlineFlat',
		INLINE_FLAT_NON_SPACE: 'inlineFlatNonSpace',
		ROW: 'row',
		COL: 'column'
	};

	PortletURL = {
		createResourceURL: async (baseURL, params) => {
			let self = this;
			let portletURL = await AUI().use(
				'aui-base, portlet-url',
				function (A) {
					portletURL = Liferay.PortletURL.createURL(baseURL);
					console.log('In AUI: ', portletURL);

					for (const key in params) {
						switch (key) {
							case 'portletId':
								portletURL.setPortletId(params[key]);
								break;
							case 'resourceId':
								portletURL.setResourceId(params[key]);
								break;
							default:
								portletURL.setParameter(
									self.namespace(key),
									params[key]
								);
						}
					}
				}
			);

			console.log('CREATE_PORTLET_INSTANCE: ', portletURL);
			return portletURL;
		}
	};

	static ResourceIds = {
		CREATE_PORTLET_INSTANCE: '/ajax/Workflow/create-portlet-instance',
		LOAD_DATATYPES: '/ajax/DTExplorer/load-datatypes',
		LOAD_DATATYPE: '/ajax/DTEditor/load-datatype',
		ADD_DATATYPE: '/ajax/DTEditor/add-datatype',
		UPDATE_DATATYPE: '/ajax/DTEditor/update-datatype',
		LOAD_ASSOCIATED_VISUALIZERS:
			'/ajax/DTEditor/load-associated-visualizers',
		LOAD_DATA_STRUCTURE: '/ajax/DSBuilder/load-data-structure',
		UPDATE_DATA_STRUCTURE: '/ajax/DSBuilder/save-data-structure',
		DELETE_DATA_STRUCTURE: '/ajax/DSBuilder/delete-data-structure',
		DELETE_TEMP_STRUCTURED_DATA: '/ajax/SDExplorer/delete-temp-file'
	};

	static LoadingStatus = {
		PENDING: 1,
		COMPLETE: 0,
		FAIL: -1
	};

	static Constant = {
		//Purposes of rendering
		FOR_NOTHING: 0,
		FOR_PREVIEW: 1,
		FOR_EDITOR: 2,
		FOR_PDF_DATA: 3,
		FOR_PDF_FORM: 4,
		FOR_SEARCH: 5,

		STOP_EVERY: false,
		CONTINUE_EVERY: true,

		FILTER_SKIP: false,
		FILTER_ADD: true,

		FAIL: false,
		SUCCESS: true,

		SINGLE: false,
		MULTIPLE: true,
		ARRAY: true,

		ERROR: 0,
		WARNING: 1,
		CONFIRM: 2,

		Commands: {
			SX_DOWNLOAD: 'SX_DOWNLOAD',
			SX_DOWNLOAD_WITH_IB: 'SX_DOWNLOAD_WITH_IB',
			SX_GET_COPIED_TEMP_FILE_PATH: 'SX_GET_COPIED_TEMP_FILE_PATH',
			SX_GET_FILE_INFO: 'SX_GET_FILE_INFO',
			UPLOAD_TEMP_FILE: 'UPLOAD_TEMP_FILE',
			UPLOAD_FILE: 'UPLOAD_TEMP_FILE',
			DELETE_DATA_FILE: 'DELETE_DATA_FILE',
			UPLOAD_DATA_FILE: 'UPLOAD_DATA_FILE'
		},
		SearchOperators: {
			OR: 'OR',
			AND: 'AND',
			NOT: 'NOT',
			RANGE: 'RANGE',
			EXACT: 'EXACT',
			LIKE: 'LIKE',
			ROOT: 'ROOT'
		},
		WorkbenchType: {
			SIMULATION_WITH_APP: 'SIMULATION_WITH_APP',
			SIMULATION_RERUN: 'SIMULATION_RERUN',
			SIMULATION_WORKFLOW: 'SIMULATION_WORKFLOW',
			SIMULATION_APP_TEST: 'SIMULATION_APP_TEST',
			SIMULATION_WORKFLOW_TEST: 'SIMULATION_WORKFLOW_TEST',
			SIMULATION_WITH_WORKFLOW: 'SIMULATION_WITH_WORKFLOW',
			ANALYSIS_RERUN_APP: 'SIMULATION_APP',
			ANALYSIS_RERUN_WORKFLOW: 'SIMULATION_WORKFLOW',
			MONITORING_ANALYSIS: 'MONITORING_ANALYSIS',
			MONITORING_RERUN_WORKFLOW: 'MONITORING_RERUN_WORKFLOW',
			ANALYSYS: 'ANALYSYS',
			CURRICULUM: 'CURRICULUM',
			VIRTUAL_LAB: 'VIRTUAL_LAB'
		},
		ClusterKey: {
			CLUSTER: '_cluster',
			IS_DEFAULT: '_isDefault'
		},
		LayoutKey: {
			LAYOUT: 'LAYOUT',
			SYSTEM: 'SYSTEM',
			INPUT: 'INPUT',
			LOG: 'LOG',
			OUTPUT: 'OUTPUT'
		},
		Action: {
			SELECT: 'SELECT',
			DEFAULT: 'DEFAULT'
		},
		PayloadType: {
			VISUALIZER_READY: 'VISUALIZER_READY',
			DATA_STRUCTURE: 'DATA_STRUCTURE',
			TERM: 'TERM',
			URL: 'URL',
			FILE: 'FILE',
			DB_CONTENT: 'DB_CONTENT',
			SDEDITOR: 'SDEDITOR'
		},
		PathType: {
			FULL_PATH: 'FULL_PATH',
			RELATIVE_PATH: 'RELATIVE_PATH',
			DL_ENTRY: 'DL_ENTRY'
		},
		FileType: {
			DL_ENTRY: 'DL_ENTRY',
			FILE_NAME: 'FILE_NAME',
			CONTENT: 'CONTENT',
			EXTENSION: 'EXTENSION'
		},
		SweepMethod: {
			BY_SLICE: 'slice',
			BY_VALUE: 'value'
		},
		DivSection: {
			SWEEP_SLICE_VALUE: 'sweepSliceValue'
		},
		OpenStatus: {
			PUBLIC: 'pb',
			RESTRICT: 'rs',
			PRIVATE: 'pr'
		},
		RepositoryTypes: {
			USER_HOME: 'USER_HOME',
			USER_JOBS: 'USER_JOBS',
			SPYGLASS: 'SPYGLASS',
			ICECAP: 'ICECAP',
			ICEBUG: 'ICEBUG',
			MERIDIAN: 'MERIDIAN',
			ICEBREAKER: 'ICEBREAKER'
		},
		ProcessStatus: {
			SUCCESS: 0,
			FAIL: -1
		},
		PortType: {
			FILE: 'FILE',
			FOLDER: 'FOLDER',
			EXT: 'EXT',
			INPUT: 'input',
			LOG: 'log',
			OUTPUT: 'output'
		},
		PortStatus: {
			EMPTY: 'empty',
			READY: 'ready',
			INVALID: 'invalid',
			LOG_VALID: 'logValid',
			LOG_INVALID: 'logInvalid',
			OUTPUT_VALID: 'outputValid',
			OUTPUT_INVALID: 'outputInvalid'
		},
		JobStatus: {
			PROLIFERATED: 'PROLIFERATED',
			CLEAN: 'CLEAN',
			DIRTY: 'DIRTY',
			SAVED: 'SAVED',
			INITIALIZE_FAILED: 'INITIALIZE_FAILED',
			INITIALIZED: 'INITIALIZED',
			SUBMISSION_FAILED: 'SUBMISSION_FAILED',
			QUEUED: 'QUEUED',
			SUSPEND_REQUESTED: 'SUSPEND_REQUESTED',
			SUSPENDED: 'SUSPENDED',
			CANCEL_REQUESTED: 'CANCEL_REQUESTED',
			CANCELED: 'CANCELED',
			SUCCESS: 'SUCCESS',
			RUNNING: 'RUNNING',
			FAILED: 'FAILED'
		},
		Location: {
			AT_LOCAL: 'local',
			AT_SERVER: 'server',
			AT_REMOTE: 'remote'
		},
		DataStatus: {
			UNCHECK: 'uncheck',
			EMPTY: 'empty',
			SAVED: 'saved',
			INVALID: 'invalid',
			VALID: 'valid',
			SAVING: 'saving',
			DIRTY: 'dirty',
			CLEAN: 'clean',
			READY: 'ready'
		},
		AppType: {
			STATIC_SOLVER: 'STATIC_SOLVER',
			DYNAMIC_SOLVER: 'DYNAMIC_SOLVER',
			STATIC_CONVERTER: 'STATIC_CONVERTER',
			DYNAMIC_CONVERTER: 'DYNAMIC_CONVERTER',
			CALCULATOR: 'CALCULATOR',
			VISUALIZER: 'VISUALIZER'
		},
		WorkflowStatus: {
			INITIALIZE: {code: 'INITIALIZE', value: 1702001},
			CREATED: {code: 'CREATED', value: 1702002},
			UPLOAD: {code: 'UPLOAD', value: 1702003},
			QUEUED: {code: 'QUEUED', value: 1702004},
			RUNNING: {code: 'RUNNING', value: 1702005},
			TRANSFER: {code: 'TRANSFER', value: 1702006},
			PAUSED: {code: 'PAUSED', value: 1702009},
			CANCELED: {code: 'CANCELED', value: 1702010},
			SUCCESS: {code: 'SUCCESS', value: 1702011},
			FAILED: {code: 'FAILED', value: 1702012}
		}
	};

	static Util = {
		isEmptyObject: (obj) => {
			// Check if the object is null or undefined
			if (obj == null) return true;
			// Check if the object is an empty array
			if (Array.isArray(obj) && obj.length === 0) return true;
			// Check if the object is an empty object
			if (
				typeof obj === 'object' &&
				!Array.isArray(obj) &&
				Object.keys(obj).length === 0
			)
				return true;
			// Iterate over all properties of the object
			for (let key in obj) {
				if (obj.hasOwnProperty(key)) {
					const value = obj[key];
					if (
						value !== null &&
						value !== undefined &&
						value !== '' &&
						!Util.isEmpty(value)
					) {
						return false;
					}
				}
			}

			return true;
		},
		deepEqual: (obj1, obj2) => {
			if (obj1 === obj2) {
				return true;
			}
			if (
				typeof obj1 !== 'object' ||
				typeof obj2 !== 'object' ||
				obj1 === null ||
				obj2 === null
			) {
				return false;
			}
			const keys1 = Object.keys(obj1);
			const keys2 = Object.keys(obj2);
			if (keys1.length !== keys2.length) {
				return false;
			}
			for (let key of keys1) {
				if (!keys2.includes(key)) {
					return false;
				}
				if (!deepEqual(obj1[key], obj2[key])) {
					return false;
				}
			}
			return true;
		},
		deepCopy: (obj) => {
			if (obj === null || typeof obj !== 'object') {
				return obj;
			}
			if (Array.isArray(obj)) {
				return obj.map(StationX.Util.deepCopy);
			}
			const copiedObj = {};
			for (let key in obj) {
				if (obj.hasOwnProperty(key)) {
					copiedObj[key] = StationX.Util.deepCopy(obj[key]);
				}
			}

			return copiedObj;
		},
		getTokenArray(sentence, regExpr = /\s+/) {
			return sentence.trim().split(regExpr);
		},
		getFirstToken(sentence) {
			let tokens = sentence.trim().split(/\s+/);

			return tokens[0];
		},
		getLastToken(sentence) {
			let tokens = sentence.trim().split(/\s+/);

			return tokens[tokens.length - 1];
		},
		split: function (str, regExpr) {
			let words = str.split(regExpr);
			words = words.filter((word) => word);

			return words;
		},
		toDateTimeString: function (value) {
			if (!value) {
				return '';
			}

			let date = new Date(Number(value));
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			let hour = date
				.getHours()
				.toLocaleString(undefined, {minimumIntegerDigits: 2});
			let minuite = date
				.getMinutes()
				.toLocaleString(undefined, {minimumIntegerDigits: 2});
			let dateAry = [
				year,
				String(month).padStart(2, '0'),
				String(day).padStart(2, '0')
			];
			let timeAry = [
				String(hour).padStart(2, '0'),
				String(minuite).padStart(2, '0')
			];
			return dateAry.join('/') + ' ' + timeAry.join(':');
		},
		toDateString: function (value) {
			if (!value) {
				return '';
			}

			let date = new Date(Number(value));
			let dateAry = [
				date.getFullYear(),
				String(date.getMonth() + 1).padStart(2, '0'),
				String(date.getDate()).padStart(2, '0')
			];

			return dateAry.join('/');
		},
		isEmpty: function (obj) {
			return Util.isEmptyObject(obj);
		},
		isNotEmpty: function (obj) {
			return !Util.isEmptyObject(obj);
		},
		isEmptyString: function (str) {
			return typeof str === 'string' && str === '';
		},
		isNotEmptyString: function (str) {
			return typeof str === 'string' && str.length > 0;
		},
		isNotNull: function (obj) {
			return obj !== null;
		},
		isNull: function (obj) {
			return obj === null;
		},
		isObject: function (obj) {
			return typeof obj === 'object';
		},
		isNonEmptyArray: function (array) {
			if (Array.isArray(array) && array.length) {
				for (let index = 0; index < array.length; index++) {
					let element = array[index];

					if (!Array.isArray(element) && (!!element || element === 0))
						return true;
					else if (Array.isArray(element)) {
						if (this.isNonEmptyArray(element)) return true;
					}
				}

				return false;
			} else {
				return false;
			}
		},
		isEmptyArray: function (ary) {
			return !this.isNonEmptyArray(ary);
		},
		isSafeNumber: function (value) {
			return Number(value) === value;
		},
		isSafeBoolean: function (value) {
			return typeof value === 'boolean';
		},
		isSafeLocalizedObject: function (val) {
			return val instanceof LocalizedObject ? true : false;
		},
		toSafeNumber: function (value, defaultVal) {
			if (this.isSafeNumber(value)) return value;

			if (Util.isEmpty(value)) return undefined;

			let number = Number(value);
			if (isNaN(number)) return defaultVal;

			return number;
		},
		toSafeBoolean: function (val, defaultVal) {
			let bool = Util.isNotEmptyString(val) ? JSON.parse(val) : val;

			return typeof bool === 'boolean' ? bool : defaultVal;
		},

		toSafeObject: function (val, defaultVal) {
			if (!$.isEmptyObject(val)) return val;

			return defaultVal;
		},
		toSafeLocalizedObject: function (val) {
			let obj;
			if (val instanceof LocalizedObject) {
				return val;
			} else {
				obj = Util.isNotEmptyString(val) ? JSON.parse(val) : val;
				return new LocalizedObject(obj);
			}
		},
		toSafePARAMId: function (val) {
			let obj;
			if (val instanceof PARAMId) {
				return val;
			} else {
				obj = Util.isNotEmptyString(val) ? JSON.parse(val) : val;
				return new PARAMId(obj.name, obj.version);
			}
		},
		guid: function () {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
				/[xy]/g,
				function (char) {
					var random = (Math.random() * 16) | 0,
						value = char === 'x' ? random : (random & 0x3) | 0x8;
					return value.toString(16);
				}
			);
		},
		safeFloatSum: function (x, y) {
			return (
				(parseFloat(x) * Constants.MAX_DIGIT +
					parseFloat(y) * Constants.MAX_DIGIT) /
				Constants.MAX_DIGIT
			);
		},
		safeFloatSubtract: function (x, y) {
			return (
				(parseFloat(x) * Constants.MAX_DIGIT -
					parseFloat(y) * Constants.MAX_DIGIT) /
				Constants.MAX_DIGIT
			);
		},
		isString: function (str) {
			return typeof str === 'string' && str.length > 0;
		},
		isInteger: function (num) {
			return num % 1 == 0;
		},
		isExponetioal: function (numStr) {
			if (numStr.search(/[eEdD]/i) == -1) return false;
			else return true;
		},
		toFloatString: function (num, exponential) {
			if (exponential) return num.toExponential();
			else return num.toString();
		},
		toLocalizedXml: function (
			jsonObject,
			availableLanguageIds,
			defaultLanguageId
		) {
			if (!availableLanguageIds) availableLanguageIds = '';
			if (!defaultLanguageId) defaultLanguageId = '';

			var xml = "<?xml version='1.0' encoding='UTF-8'?>";
			xml += "<root available-locales='";
			xml += availableLanguageIds + "' ";
			xml += "default-locale='" + defaultLanguageId + "'>";

			for (var languageId in jsonObject) {
				var value = jsonObject[languageId];
				xml +=
					"<display language-id='" +
					languageId +
					"'>" +
					value +
					'</display>';
			}
			xml += '</root>';

			return xml;
		},
		toJSON: function (obj) {
			return JSON.parse(JSON.stringify(obj));
		},
		convertToPath: function (filePath) {
			var path = {};
			if (!filePath) {
				path.parent_ = '';
				path.name_ = '';
				return path;
			}

			filePath = this.removeEndSlashes(filePath);

			var lastIndexOfSlash = filePath.lastIndexOf('/');
			if (lastIndexOfSlash < 0) {
				path.parent_ = '';
				path.name_ = filePath;
			} else {
				path.parent_ = filePath.slice(0, lastIndexOfSlash);
				path.name_ = filePath.slice(lastIndexOfSlash + 1);
			}

			return path;
		},
		extractFileName: function (filePath) {
			var path = this.convertToPath(filePath);
			return path.name();
		},
		removeEndSlashes: function (strPath) {
			if (!strPath) {
				return strPath;
			}

			while (strPath.startsWith('/')) {
				strPath = strPath.slice(1);
			}

			while (strPath.endsWith('/')) {
				strPath = strPath.slice(0, strPath.length - 1);
			}

			return strPath;
		},
		removeArrayElement: function (array, index) {
			array.splice(index, 1);
			return array;
		},
		isBrowserEdge: function () {
			var ua = navigator.userAgent,
				tem,
				M =
					ua.match(
						/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
					) || [];
			if (/trident/i.test(M[1])) {
				tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
				//return {name:'IE',version:(tem[1]||'')};
				return false;
			}

			return true;
		},
		addFirstArgument: function (argument, args) {
			var newArgs = [];
			for (var i = 0; i < args.length; i++) {
				newArgs.push(args[i]);
			}
			newArgs.unshift(argument);
			return newArgs;
		},
		mergePath: function (parent, child) {
			parent = this.removeEndSlashes(parent);
			child = this.removeEndSlashes(child);
			if (!parent && !child) return '';
			if (!parent) return child;
			if (!child) return parent;

			return parent + '/' + child;
		},
		getBaseDir: function (userScreenName) {
			if (userScreenName === 'edison' || userScreenName === 'edisonadm')
				return '';
			else return userScreenName;
		},
		blockStart: function ($block, $message) {
			$block.block({
				message: $message,
				css: {border: '3px solid #a00'}
			});
		},
		blockEnd: function ($block) {
			$block.unblock();
		},
		evalHttpParamSeparator: function (baseURL) {
			var sep = baseURL.indexOf('?') > -1 ? '&' : '?';
			return sep;
		},
		getJobStatusValue: function (code) {
			var map = Enumeration.WorkflowStatus[code.toUpperCase()];
			if (typeof map == 'undefined') {
				console.log('getJobStatusValue_No CODE', code);
				return null;
			} else {
				return map.value;
			}
		},
		getJobStatusCode: function (value) {
			var map = Enumeration.WorkflowStatus;
			for (var codeKey in map) {
				if (map[codeKey].value == value) {
					return map[codeKey].code;
				}
			}
			return null;
		},
		getLocalFile: function (anchor) {
			return $(anchor)[0].files[0];
		},
		getLocalFileName: function (anchor) {
			let fileName = $(anchor).val();

			let slashIndex = fileName.lastIndexOf('\\');
			if (slashIndex < 0) slashIndex = fileName.lastIndexOf('/');

			return fileName.slice(slashIndex + 1);
		},
		randomString: function (length, code) {
			let mask = '';
			if (code.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
			if (code.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			if (code.indexOf('1') > -1) mask += '0123456789';
			if (code.indexOf('!') > -1)
				mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
			let result = '';
			for (let i = length; i > 0; --i) {
				result += mask[Math.floor(Math.random() * mask.length)];
			}
			return result;
		},
		createFormData: function (jsonData) {
			let formData = new FormData();
			for (let key in jsonData) {
				formData.append(NAMESPACE + key, jsonData[key]);
			}

			return formData;
		},
		readFile(file) {
			let loader = new FileReader();
			let def = $.Deferred();
			let promise = def.promise();

			//--- provide classic deferred interface
			loader.onload = function (e) {
				def.resolve(e.target.result);
			};
			loader.onprogress = loader.onloadstart = function (e) {
				def.notify(e);
			};
			loader.onerror = loader.onabort = function (e) {
				def.reject(e);
			};
			promise.abort = function () {
				return loader.abort.apply(loader, arguments);
			};

			loader.readAsBinaryString(file);

			return promise;
		},
		buildMultipart(formData) {
			let partKey,
				crunks = [],
				bound = false;
			while (!bound) {
				bound = $.md5
					? $.md5(new Date().valueOf())
					: new Date().valueOf();
				for (partKey in formData) {
					console.log(
						'formData[partKey]:',
						partKey,
						formData[partKey]
					);
					if (~formData[partKey].indexOf(bound)) {
						bound = false;
						continue;
					}
				}
			}

			for (let partKey = 0, l = formData.length; partKey < l; partKey++) {
				if (typeof formData[partKey].value !== 'string') {
					crunks.push(
						'--' +
							bound +
							'\r\n' +
							'Content-Disposition: form-data; name="' +
							formData[partKey].name +
							'"; filename="' +
							formData[partKey].value[1] +
							'"\r\n' +
							'Content-Type: application/octet-stream\r\n' +
							'Content-Transfer-Encoding: binary\r\n\r\n' +
							formData[partKey].value[0]
					);
				} else {
					crunks.push(
						'--' +
							bound +
							'\r\n' +
							'Content-Disposition: form-data; name="' +
							formData[partKey].name +
							'"\r\n\r\n' +
							formData[partKey].value
					);
				}
			}

			return {
				bound: bound,
				data: crunks.join('\r\n') + '\r\n--' + bound + '--'
			};
		},
		uploadFile(url, file, dataObj = null, asTempFile = false) {
			let deferred = $.Deferred(),
				promise = deferred.promise();

			Util.readFile(file).done((fileData) => {
				if (Util.isEmpty(dataObj)) dataObj = new Object();
				dataObj.asTempFile = asTempFile;
				dataObj.file = [fileData, file.name];
				console.log('Finish read a file: ', dataObj);

				let _formData = Util.createFormData(dataObj);

				console.log('_formData:', _formData);
				let multiPart = Util.buildMultipart(_formData);

				let req = $.ajax({
					url: url,
					type: 'POST',
					dataType: 'json',
					data: _formData,
					processData: false,
					contentType:
						'multipart/form-data; boundary=' + multiPart.bound,
					xhr: function () {
						let xhr = $.ajaxSettings.xhr();
						if (xhr.upload) {
							xhr.upload.addEventListener(
								'progress',
								function (event) {
									let percent = 0;
									//let position = event.loaded || event.position; /*event.position is deprecated*/
									let position = event.loaded;
									let total = event.total;
									if (event.lengthComputable) {
										percent = Math.ceil(
											(position / total) * 100
										);
										deferred.notify(percent);
									}
								},
								false
							);
						}
						return xhr;
					}
				});

				req.done(function () {
					deferred.resolve.apply(deferred, arguments);
				}).fail(function () {
					deferred.reject.apply(deferred, arguments);
				});

				promise.abort = function () {
					return req.abort.apply(req, arguments);
				};
			});

			return promise;
		},
		conformInRange: function (from, to, data) {
			if (typeof from === 'number' && typeof to === 'number') {
				return data >= from && data <= to;
			} else if (typeof from !== 'number' && typeof to === 'number') {
				return data <= to;
			} else if (typeof from === 'number' && typeof to !== 'number') {
				return data >= from;
			}
		}
	};

	static Event = {
		SX_PREVIEW_DELETE_PARAM: 'SX_PREVIEW_DELETE_PARAM',
		SX_PREVIEW_GROUPUP_PARAM: 'SX_PREVIEW_GROUPUP_PARAM',
		SX_PREVIEW_COPY_PARAM: 'SX_PREVIEW_COPY_PARAM',
		SX_PARAM_SELECTED: 'SX_PARAM_SELECTED',
		SX_FORM_UI_SHOW_PARAMS: 'SX_FORM_UI_SHOW_PARAMS',
		SX_FORM_UI_CHECKBOX_CHANGED: 'SX_FORM_UI_CHECKBOX_CHANGED',
		SX_REMOVE_SLAVE_PARAMS: 'SX_REMOVE_SLAVE_PARAMS',
		SX_PARAM_PROPERTY_CHANGED: 'SX_PARAM_PROPERTY_CHANGED',
		SX_PARAM_VALUE_CHANGED: 'SX_PARAM_PROPERTY_CHANGED',

		LIST_OPTION_PREVIEW_REMOVED: 'LIST_OPTION_PREVIEW_REMOVED',
		LIST_OPTION_PREVIEW_ADDED: 'LIST_OPTION_PREVIEW_ADDED',
		LIST_OPTION_PREVIEW_CHANGED: 'LIST_OPTION_PREVIEW_CHANGED',
		LIST_DISPLAY_STYLE_CHANGED: 'LIST_DISPLAY_STYLE_CHANGED',
		LIST_OPTION_PREVIEW_SELECTED: 'LIST_OPTION_PREVIEW_SELECTED',
		CHOOSE_SLAVE_PARAMS: 'CHOOSE_SLAVE_PARAMS',
		CHOOSE_GROUP_PARAMS: 'CHOOSE_GROUP_PARAMS',
		SELECT_GRID_COLUMNS: 'SELECT_GRID_COLUMNS',
		GRID_COLUMN_SELECTED: 'GRID_COLUMN_SELECTED',

		SEARCH_FROM_DATE_CHANGED: 'SEARCH_FROM_DATE_CHANGED',
		SEARCH_TO_DATE_CHANGED: 'SEARCH_TO_DATE_CHANGED',
		SEARCH_FROM_NUMERIC_CHANGED: 'SEARCH_FROM_NUMERIC_CHANGED',
		SEARCH_TO_NUMERIC_CHANGED: 'SEARCH_TO_NUMERIC_CHANGED',
		SEARCH_KEYWORD_REMOVE_ALL: 'SEARCH_KEYWORD_REMOVE_ALL',
		SEARCH_KEYWORD_ADDED: 'SEARCH_KEYWORD_ADDED',
		SD_DATE_RANGE_SEARCH_STATE_CHANGED:
			'SD_DATE_RANGE_SEARCH_STATE_CHANGED',
		SEARCH_STATE_CHANGED: 'SEARCH_STATE_CHANGED',
		SEARCH_KEYWORD_REMOVED: 'SEARCH_KEYWORD_REMOVED',
		SEARCH_KEYWORD_CHANGED: 'SEARCH_KEYWORD_CHANGED',
		SEARCH_HISTORY_CHANGED: 'SEARCH_HISTORY_CHANGED',
		OPEN_QUERY_EDITOR: 'OPEN_QUERY_EDITOR',
		QUERY_CHANGED: 'QUERY_CHANGED',
		SHOW_SEARCH_RESULTS: 'SHOW_SEARCH_RESULTS',
		SEARCH_QUERY_DELIVER: 'SEARCH_QUERY_DELIVER',

		SX_CANCEL_CLICKED: 'SX_CANCEL_CLICKED',
		SX_CANCEL_JOB: 'SX_CANCEL_JOB',
		SX_CANCEL_SIMULATION: 'SX_CANCEL_SIMULATION',
		SX_COPY_JOB: 'SX_COPY_JOB',
		SX_REQUEST_COPY_JOB: 'SX_REQUEST_COPY_JOB',
		SX_RESPONSE_COPY_JOB: 'SX_REQUEST_COPY_JOB',
		SX_REFRESH_URL_CHANGE: 'SX_REFRESH_URL_CHANGE',
		SX_CREATE_JOB: 'SX_CREATE_JOB',
		SX_CREATE_SIMULATION: 'SX_CREATE_SIMULATION',
		SX_DATA_LOADED: 'SX_DATA_LOADED',
		SX_DATA_STRUCTURE_CHANGED: 'SX_DATA_STRUCTURE_CHANGED',
		SX_DELETE_JOB: 'SX_DELETE_JOB',
		SX_DELETE_SIMULATION: 'SX_DELETE_SIMULATION',
		SX_DOWNLOAD_FILE: 'SX_DOWNLOAD_FILE',
		SX_ERROR: 'SX_ERROR',
		SX_EVENTS_REGISTERED: 'SX_EVENTS_REGISTERED',
		SX_FILE_DESELECTED: 'SX_FILE_DESELECTED',
		SX_FILE_SAVED_AS: 'SX_FILE_SAVED_AS',
		SX_FILE_SELECTED: 'SX_FILE_SELECTED',
		SX_HANDSHAKE: 'SX_HANDSHAKE',
		SX_INITIALIZE: 'SX_INITIALIZE',
		SX_JOB_CREATED: 'SX_JOB_CREATED',
		SX_JOB_DELETED: 'SX_JOB_DELETED',
		SX_JOB_SAVED: 'SX_JOB_SAVED',
		SX_JOB_SELECTED: 'SX_JOB_SELECTED',
		SX_JOB_STATUS_CHANGED: 'SX_JOB_STATUS_CHANGED',
		SX_LOAD_DATA: 'SX_LOAD_DATA',
		SX_DISABLE_CONTROLS: 'SX_DISABLE_CONTROLS',
		SX_CHECK_MANDATORY: 'SX_CHECK_MANDATORY',
		SX_LOAD_FILE: 'SX_LOAD_FILE',
		SX_LOAD_HTML: 'SX_LOAD_HTML',
		SX_OK_CLICKED: 'SX_OK_CLICKED',
		SX_PORT_SELECTED: 'SX_PORT_SELECTED',
		SX_PORT_STATUS_CHANGED: 'SX_PORT_STATUS_CHANGED',
		SX_READ_LOCAL_FILE: 'SX_READ_LOCAL_FILE',
		SX_READ_SERVER_FILE: 'SX_READ_SERVER_FILE',
		SX_READ_STRUCTURED_DATA_FILE: 'SX_READ_STRUCTURED_DATA_FILE',
		SX_REFRESH: 'SX_REFRESH',
		SX_REFRESH_SIMULATIONS: 'SX_REFRESH_SIMULATIONS',
		SX_REFRESH_JOBS: 'SX_REFRESH_JOBS',
		SX_REFRESH_JOB_STATUS: 'SX_REFRESH_JOB_STATUS',
		SX_REFRESH_OUTPUT_VIEW: 'SX_REFRESH_OUTPUT_VIEW',
		SX_REFRESH_PORTS_STATUS: 'SX_REFRESH_PORTS_STATUS',
		SX_REGISTER_EVENTS: 'SX_REGISTER_EVENTS',
		SX_REPLACE_PORTLET: 'SX_REPLACE_PORTLET',
		SX_REPORT_NAMESPACE: 'SX_REPORT_NAMESPACE',
		SX_REQUEST_APP_INFO: 'SX_REQUEST_APP_INFO',
		SX_REQUEST_DATA: 'SX_REQUEST_DATA',
		SX_REQUEST_DATA_STRUCTURE: 'SX_REQUEST_DATA',
		SX_REQUEST_DELETE_FILE: 'SX_REQUEST_DELETE_FILE',
		SX_REQUEST_DOWNLOAD: 'SX_REQUEST_DOWNLOAD',
		SX_REQUEST_FILE_PATH: 'SX_REQUEST_FILE_PATH',
		SX_REQUEST_FILE_URL: 'SX_REQUEST_FILE_URL',
		SX_REQUEST_JOB_UUID: 'SX_REQUEST_JOB_UUID',
		SX_REQUEST_MONITOR_INFO: 'SX_REQUEST_MONITOR_INFO',
		SX_REQUEST_OUTPUT_PATH: 'SX_REQUEST_OUTPUT_PATH',
		SX_REQUEST_PATH: 'SX_REQUEST_PATH',
		SX_REQUEST_PORT_INFO: 'SX_REQUEST_PORT_INFO',
		SX_REQUEST_SAMPLE_CONTENT: 'SX_REQUEST_SAMPLE_CONTENT',
		SX_REQUEST_SAMPLE_URL: 'SX_REQUEST_SAMPLE_URL',
		SX_REQUEST_SIMULATION_UUID: 'SX_REQUEST_SIMULATION_UUID',
		SX_REQUEST_SPREAD_TO_PORT: 'SX_REQUEST_SPREAD_TO_PORT',
		SX_REQUEST_UPLOAD: 'SX_REQUEST_UPLOAD',
		SX_REQUEST_WORKING_JOB_INFO: 'SX_REQUEST_WORKING_JOB_INFO',
		SX_RESPONSE_APP_INFO: 'SX_RESPONSE_APP_INFO',
		SX_RESPONSE_DATA: 'SX_RESPONSE_DATA',
		SX_RESPONSE_JOB_UUID: 'SX_RESPONSE_JOB_UUID',
		SX_RESPONSE_MONITOR_INFO: 'SX_RESPONSE_MONITOR_INFO',
		SX_RESPONSE_PORT_INFO: 'SX_RESPONSE_PORT_INFO',
		SX_RESPONSE_SIMULATION_UUID: 'SX_RESPONSE_SIMULATION_UUID',
		SX_SAMPLE_SELECTED: 'SX_SAMPLE_SELECTED',
		SX_SAVEAS_FILE: 'SX_SAVEAS_FILE',
		SX_SAVE_SIMULATION: 'SX_SAVE_SIMULATION',
		SX_SELECT_LOCAL_FILE: 'SX_SELECT_LOCAL_FILE',
		SX_SELECT_SERVER_FILE: 'SX_SELECT_SERVER_FILE',
		SX_SHOW_JOB_STATUS: 'SX_SHOW_JOB_STATUS',
		SX_SIMULATION_CREATED: 'SX_SIMULATION_CREATED',
		SX_SIMULATION_DELETED: 'SX_SIMULATION_DELETED',
		SX_SIMULATION_SAVED: 'SX_SIMULATION_SAVED',
		SX_SIMULATION_SELECTED: 'SX_SIMULATION_SELECTED',
		SX_SUBMIT_SIMULATION: 'SX_SUBMIT_SIMULATION',
		SX_SUBMIT_JOB: 'SX_SUBMIT_JOB',
		SX_STRUCTURED_DATA_CHANGED: 'SX_STRUCTURED_DATA_CHANGED',
		PARAM_VALUE_CHANGED: 'PARAM_VALUE_CHANGED',
		SX_UPLOAD_FILE: 'SX_UPLOAD_FILE',
		SX_UPLOAD_SELECTED: 'SX_UPLOAD_SELECTED',
		SX_RESPONSE_SAVE_SIMULATION_RESULT:
			'SX_RESPONSE_SAVE_SIMULATION_RESULT',
		SX_RESPONSE_CREATE_SIMULATION_RESULT:
			'SX_RESPONSE_CREATE_SIMULATION_RESULT',
		SX_RESPONSE_DELETE_SIMULATION_RESULT:
			'SX_RESPONSE_DELETE_SIMULATION_RESULT',
		SX_RESPONSE_CREATE_SIMULATION_JOB_RESULT:
			'SX_RESPONSE_CREATE_SIMULATION_JOB_RESULT',
		SX_RESPONSE_DELETE_SIMULATION_JOB_RESULT:
			'SX_RESPONSE_DELETE_SIMULATION_JOB_RESULT',
		SX_RESPONSE_CANCLE_SIMULATION_JOB_RESULT:
			'SX_RESPONSE_CANCLE_SIMULATION_JOB_RESULT',
		SX_REQUEST_SIMULATION_MODAL: 'SX_REQUEST_SIMULATION_MODAL',
		SX_RESPONSE_SIMULATION_MODAL: 'SX_RESPONSE_SIMULATION_MODAL',
		SX_REQUEST_SIMULATION_EDIT_VIEW: 'SX_REQUEST_SIMULATION_EDIT_VIEW',
		SX_RESPONSE_SIMULATION_EDIT_VIEW: 'SX_RESPONSE_SIMULATION_EDIT_VIEW',
		SX_REQUEST_DELETE_JOB_VIEW: 'SX_REQUEST_DELETE_JOB_VIEW',
		SX_REPONSE_DELETE_JOB_VIEW: 'SX_REPONSE_DELETE_JOB_VIEW',
		SX_REQUEST_JOB_EDIT_VIEW: 'SX_REQUEST_JOB_EDIT_VIEW',
		SX_RESPONSE_JOB_EDIT_VIEW: 'SX_RESPONSE_JOB_EDIT_VIEW',
		SX_REQUEST_JOB_RESULT_VIEW: 'SX_REQUEST_JOB_RESULT_VIEW',
		SX_RESPONSE_JOB_RESULT_VIEW: 'SX_RESPONSE_JOB_RESULT_VIEW',
		SX_REQUEST_NEW_JOB_VIEW: 'SX_REQUEST_NEW_JOB_VIEW',
		SX_RESPONSE_NEW_JOB_VIEW: 'SX_RESPONSE_NEW_JOB_VIEW',
		SX_REQUEST_FLOW_LAYOUT_CODE_UPDATE: 'SX_FLOW_LAYOUT_CODE_UPDATE',
		SX_RESPONSE_FLOW_LAYOUT_CODE_UPDATE: 'SX_FLOW_LAYOUT_CODE_UPDATE',
		SX_RESPONSE_SUBMIT_JOB_RESULT: 'SX_RESPONSE_SUBMIT_JOB_RESULT',
		SX_REQUEST_JOB_LOG_VIEW: 'SX_REQUEST_JOB_LOG_VIEW',
		SX_RESPONSE_JOB_LOG_VIEW: 'SX_RESPONSE_JOB_LOG_VIEW',
		SX_REQUEST_COLLECTION_VIEW: 'SX_REQUEST_COLLECTION_VIEW',
		SX_RESPONSE_COLLECTION_VIEW: 'SX_RESPONSE_COLLECTION_VIEW',
		SX_REQUEST_JOB_KEY: 'SX_REQUEST_JOB_KEY',
		SX_RESPONSE_JOB_KEY: 'SX_RESPONSE_JOB_KEY',
		SX_FROM_EDITOR_EVENT: 'SX_FROM_EDITOR_EVENT',
		SX_FROM_ANALYZER_EVENT: 'SX_FROM_ANALYZER_EVENT',
		SX_REQUEST_JOB_CONTROLL_RESET: 'SX_REQUEST_JOB_CONTROLL_RESET',
		SX_RESPONSE_JOB_CONTROLL_RESET: 'SX_RESPONSE_JOB_CONTROLL_RESET',
		SX_RESPONSE_CANCLE_JOB_RESULT: 'SX_RESPONSE_CANCLE_JOB_RESULT',
		SX_REQUEST_JOB_INPUT_VALIDATION: 'SX_REQUEST_JOB_INPUT_VALIDATION',
		SX_RESPONSE_JOB_INPUT_VALIDATION: 'SX_RESPONSE_JOB_INPUT_VALIDATION',
		SX_VISUALIZER_READY: 'SX_VISUALIZER_READY',
		SX_VISUALIZER_DATA_CHANGED: 'SX_VISUALIZER_DATA_CHANGED',
		SX_VISUALIZER_DATA_LOADED: 'SX_VISUALIZER_DATA_LOADED',
		SX_VISUALIZER_WAITING: 'SX_VISUALIZER_WAITING',
		fire: (event, dataPacket) => {
			Liferay.fire(event, {
				dataPacket: dataPacket
			});
		},
		on: (event, handler) => {
			Liferay.detach(event).on(event, handler);
		},
		createEventDataPacket: (sourcePortlet, targetPortlet, params) => {
			return {
				sourcePortlet: sourcePortlet,
				targetPortlet: targetPortlet,
				isNotMine: (myId) => {
					return !targetPortlet || targetPortlet !== myId;
				},
				...params
			};
		}
	};

	static ParamType = {
		/*01.*/ STRING: 'String',
		/*02.*/ LOCALIZED_STRING: 'LocalizedString',
		/*03.*/ NUMERIC: 'Numeric',
		/*04.*/ INTEGER: 'Integer',
		/*05.*/ BOOLEAN: 'Boolean',
		/*06.*/ SELECT: 'Selct',
		/*07.*/ MATRIX: 'Matrix',
		/*08.*/ FILE: 'File',
		/*09.*/ ADDRESS: 'Address',
		/*10.*/ DATE: 'Date',
		/*11.*/ PHONE: 'Phone',
		/*12.*/ EMAIL: 'EMail',
		/*13.*/ GROUP: 'Group',
		/*14.*/ SELECT_GROUP: 'SelectGroup',
		/*15.*/ GRID: 'Grid',
		/*16.*/ TABLE_GRID: 'TableGrid',
		/*17.*/ CALCULATOR: 'Calculator',
		/*18.*/ REFERENCE: 'Reference',
		/*19.*/ LINKER: 'Linker',
		/*20.*/ COMMENT: 'Comment',

		DEFAULT_TYPE: 'String'
	};

	static DataStructureAttributes = {
		TERM_DELIMITER: 'termDelimiter',
		TERM_DELIMITER_POSITION: 'termDelimiterPosition',
		TERM_VALUE_DELIMITER: 'termValueDelimiter',
		MATRIX_BRACKET_TYPE: 'matrixBracketType',
		MATRIX_ELEMENT_DELIMITER: 'matrixElementDelimiter',
		COMMENT_CHAR: 'commentChar',
		TERMS: 'terms',
		INPUT_STATUS_DISPLAY: 'inputStatusDisplay',
		GOTO: 'goTo'
	};
}

class SXParameter {
	static DEFAULT_ID = 0;
	static DEFAULT_VERSION = '1.0.0';
	static DEFAULT_MANDATORY = false;
	static DEFAULT_ABSTRACT_KEY = false;
	static DEFAULT_SEARCHABLE = true;
	static DEFAULT_DOWNLOADABLE = true;

	static STATE_ACTIVE = true;
	static STATE_INACTIVE = false;

	static STATUS_ANY = -1;
	static STATUS_APPROVED = 0;
	static STATUS_PENDING = 1;
	static STATUS_DRAFT = 2;
	static STATUS_EXPIRED = 3;
	static STATUS_DENIED = 4;
	static STATUS_INACTIVE = 5;
	static STATUS_INCOMPLETE = 6;
	static STATUS_SCHEDULED = 7;
	static STATUS_IN_TRASH = 8;

	#termType;
	#termName;
	#termVersion;
	#displayName;

	#abstractKey;
	#searchable;
	#downloadable;
	#synonyms;
	#mandatory;
	#disabled;
	#definition;
	#tooltip;
	#order;
	#dirty;
	#groupTermId;
	#masterTerm;
	#id;
	#gridTerm;

	#standard;
	#status;
	#state;

	#cssWidth;
	#cssCustom;

	#$rendered;
	#$pdf;

	get id() {
		return this.#id;
	}
	set id(val) {
		this.#id = Util.toSafeNumber(val);
	}
	get termType() {
		return this.#termType;
	}
	set termType(val) {
		this.#termType = val;
	}
	get termName() {
		return this.#termName;
	}
	set termName(val) {
		this.#termName = val;
	}
	get termVersion() {
		return this.#termVersion;
	}
	set termVersion(val) {
		this.#termVersion = val;
	}
	get synonyms() {
		return this.#synonyms;
	}
	set synonyms(val) {
		this.#synonyms = val;
	}
	get displayName() {
		return this.#displayName;
	}
	set displayName(val) {
		this.#displayName = Util.toSafeLocalizedObject(val);
	}
	get definition() {
		return this.#definition;
	}
	set definition(val) {
		this.#definition = Util.toSafeLocalizedObject(val);
	}
	get tooltip() {
		return this.#tooltip;
	}
	set tooltip(val) {
		this.#tooltip = Util.toSafeLocalizedObject(val);
	}
	get mandatory() {
		return this.#mandatory;
	}
	set mandatory(val) {
		this.#mandatory = Util.toSafeBoolean(val, false);
	}
	get disabled() {
		return this.#disabled;
	}
	set disabled(val) {
		this.#disabled = Util.toSafeBoolean(val, false);

		if (!this.isRendered()) return;

		switch (this.termType) {
			case TermTypes.STRING: {
				console.log('disable string');
				let tag = this.multipleLine ? 'textarea' : 'input';
				this.$rendered
					.find(tag)
					.first()
					.prop('disabled', this.#disabled);
				break;
			}
			case TermTypes.NUMERIC:
			case TermTypes.MATRIX:
			case TermTypes.EMAIL:
			case TermTypes.PHONE:
			case TermTypes.FILE:
			case TermTypes.DATE: {
				console.log('disable numeric');
				this.$rendered.find('input').prop('disabled', this.#disabled);
				break;
			}
			case TermTypes.ADDRESS: {
				this.$rendered
					.find('input')
					.last()
					.prop('disabled', this.#disabled);
				break;
			}
			case TermTypes.LIST:
			case TermTypes.BOOLEAN: {
				let tag = this.displayStyle === 'select' ? 'select' : 'input';
				this.$rendered.find(tag).prop('disabled', this.#disabled);
				break;
			}
			/*
				case TermTypes.GROUP:
				{
					let cmd = val ? 'disable' : 'enable';
					this.$rendered.find('.ui-accordion').first().accordion(cmd);
					break;
				}
				*/
		}
	}
	get abstractKey() {
		return this.#abstractKey;
	}
	set abstractKey(val) {
		this.#abstractKey = Util.toSafeBoolean(val, false);
	}
	get downloadable() {
		return this.#downloadable;
	}
	set downloadable(val) {
		this.#downloadable = Util.toSafeBoolean(val, true);
	}
	get searchable() {
		return this.#searchable;
	}
	set searchable(val) {
		this.#searchable = Util.toSafeBoolean(val, false);
	}
	get standard() {
		return this.#standard;
	}
	set standard(val) {
		this.#standard = Util.toSafeBoolean(val, false);
	}
	get masterTerm() {
		return this.#masterTerm;
	}
	set masterTerm(val) {
		this.#masterTerm = val;
	}
	get cssWidth() {
		return this.#cssWidth;
	}
	set cssWidth(val) {
		this.#cssWidth = val ? val : '100%';
	}
	get cssCustom() {
		return this.#cssCustom;
	}
	set cssCustom(val) {
		this.#cssCustom = val;
	}
	get gridTerm() {
		return this.#gridTerm;
	}
	set gridTerm(val) {
		this.#gridTerm = val;
	}

	get $rendered() {
		return this.#$rendered;
	}
	set $rendered(val) {
		this.#$rendered = val;
	}
	get $pdf() {
		return this.#$pdf;
	}
	set $pdf(val) {
		this.#$pdf = val;
	}
	get $label() {
		return this.#$rendered.find('.sx-label-text').first();
	}

	get dirty() {
		return this.#dirty;
	}
	set dirty(val) {
		this.#dirty = val;
	}
	get state() {
		return this.#state;
	}
	set state(val) {
		this.#state = val;
	}
	get status() {
		return this.#status;
	}
	set status(val) {
		this.#status = val;
	}
	get order() {
		return this.#order;
	}
	set order(val) {
		this.#order = Util.toSafeNumber(val);
	}
	get groupTermId() {
		if (!this.#groupTermId) {
			this.#groupTermId = new TermId();
		}
		return this.#groupTermId;
	}
	set groupTermId(val) {
		this.#groupTermId = Util.toSafeTermId(val);
	}

	get groupId() {
		return this.groupTermId;
	}
	get termId() {
		return new TermId(this.termName, this.termVersion);
	}

	constructor(termType) {
		this.id = 0;
		this.termType = termType;

		this.abstractKey = false;
		this.disabled = false;
		this.searchable = true;
		this.downloadable = true;
		this.mandatory = false;
		this.termVersion = '1.0.0';
		this.state = Term.STATE_ACTIVE;
		this.standard = false;
		this.dirty = false;

		//this.cssWidth = '100%';
	}

	static validateTermVersion(updated, previous) {
		let updatedParts = updated.split('.');

		let validationPassed = true;

		// Check valid format
		if (updatedParts.length !== 3) return false;

		updatedParts.every((part) => {
			let int = Number(part);

			if (Number.isInteger(int)) {
				return Constants.CONTINUE_EVERY;
			} else {
				validationPassed = Constants.FAIL;
				return Constants.STOP_EVERY;
			}
		});

		if (!validationPassed) return false;

		// updated version should be bigger than previous versison
		if (previous) {
			let previousParts = previous.split('.');

			if (Number(updatedParts[0]) < Number(previousParts[0])) {
				validationPassed = false;
			} else if (Number(updatedParts[1]) < Number(previousParts[1])) {
				validationPassed = false;
			} else if (Number(updatedParts[2]) <= Number(previousParts[2])) {
				validationPassed = false;
			}
		}

		return validationPassed;
	}

	static validateTermName(termName) {
		return /^[_|a-z|A-Z][_|a-z|A-Z|0-9]*/.test(termName);
	}

	activate(active = Term.STATE_ACTIVE) {
		this.state = active;

		if (!this.isRendered()) return;

		if (active === Term.STATE_ACTIVE) {
			this.$rendered.show();
		} else {
			this.$rendered.hide();
		}
	}

	getPreviewPopupAction() {
		let self = this;

		let items = {
			copy: {
				name: '<span style="font-size:0.8rem;font-weight:400;">Copy</span>',
				icon: '<span class="ui-icon ui-icon-copy"></span>'
			},
			delete: {
				name: '<span style="font-size:0.8rem;font-weight:400;">Delete</span>',
				icon: '<span class="ui-icon ui-icon-trash"></span>'
			}
		};

		if (this.isMemberOfGroup()) {
			items.groupUp = {
				name: '<span style="font-size:0.8rem;font-weight:400;">Group Up</span>',
				icon: '<span class="ui-icon ui-icon-arrowreturnthick-1-n"></span>'
			};
		}

		if (this.isGroupTerm()) {
			items.deleteAll = {
				name: '<span style="font-size:0.8rem;font-weight:400;">Delete All</span>',
				icon: '<span class="ui-icon ui-icon-closethick"></span>'
			};
		}

		return {
			items: items,
			callback: function (item) {
				let dataPacket = Util.createEventDataPacket(
					NAMESPACE,
					NAMESPACE
				);
				dataPacket.source = 'getPreviewPopupAction()';
				dataPacket.term = self;

				let message;

				switch ($(item).prop('id')) {
					case 'copy': {
						message = Events.DATATYPE_PREVIEW_COPY_TERM;
						break;
					}
					case 'delete': {
						message = Events.DATATYPE_PREVIEW_DELETE_TERM;
						dataPacket.children = false;
						break;
					}
					case 'groupUp': {
						message = Events.DATATYPE_PREVIEW_GROUPUP_TERM;
						break;
					}
					case 'deleteAll': {
						message = Events.DATATYPE_PREVIEW_DELETE_TERM;
						dataPacket.children = true;
						break;
					}
				}

				Util.fire(message, dataPacket);
			},
			position: 'left'
		};
	}

	isTopLevel() {
		return this.groupId.isEmpty();
	}

	isRendered() {
		return !!this.$rendered;
	}

	displayInputStatus(status) {
		if (!this.isRendered()) return;

		if (!status) {
			return 0;
		}

		if (this.hasValue()) {
			return 1;
		} else {
			return 0;
		}
	}

	isOrdered() {
		return this.order && this.order > 0 ? true : false;
	}

	isHighlighted() {
		if (!this.$rendered) return false;
		return this.$rendered.hasClass('highlight-border');
	}

	isMemberOfGroup() {
		return this.groupTermId && this.groupTermId.isNotEmpty();
	}

	isGroupTerm() {
		return this.termType === TermTypes.GROUP;
	}

	isColumn() {
		return !!this.#gridTerm;
	}

	isVisible() {
		return this.#$rendered ? this.#$rendered.is(':visible') : false;
	}

	isActive() {
		return this.#state === Term.STATE_ACTIVE;
	}

	isSlave() {
		return !Util.isEmpty(this.masterTerm);
	}

	emptyRender() {
		if (this.$rendered) {
			this.$rendered.remove();
			this.$rendered = undefined;
		}
	}

	equal(term) {
		if (this === term) {
			return true;
		}

		if (
			this.termName === term.termName &&
			this.termVersion === this.termVersion
		) {
			return true;
		}

		return false;
	}

	getLocalizedDisplayName() {
		if (!this.displayName || this.displayName.isEmpty()) {
			return '';
		} else {
			return this.displayName.getText(CURRENT_LANGUAGE);
		}
	}

	getLocalizedDefinition() {
		if (!this.definition || this.definition.isEmpty()) {
			return '';
		} else {
			return this.definition.getText(CURRENT_LANGUAGE);
		}
	}

	getLocalizedTooltip() {
		if (!this.tooltip || this.tooltip.isEmpty()) {
			return '';
		} else {
			const tooltip = this.tooltip.getText(CURRENT_LANGUAGE);
			return tooltip ? tooltip : this.tooltip.getText(DEFAULT_LANGUAGE);
		}
	}

	multiSelectize() {}

	/**
	 *  Validate the term name matches naming pattern.
	 *  If it is needed to change naming pattern,
	 *  change VALID_NAME_PATTERN static value.
	 *
	 *   @return
	 *   		true,		if matched
	 *   		false,		when not matched
	 */
	validateNameExpression(name) {
		if (name) {
			return Term.VALID_NAME_PATTERN.test(name);
		} else {
			return Term.VALID_NAME_PATTERN.test(this.termName);
		}
	}

	validateMandatoryFields() {
		if (!this.termName) return 'termName';
		if (!this.termVersion) {
			this.getTermVersionFormValue();
			if (!this.termVersion) return 'termVersion';
		}
		if (!this.displayName || this.displayName.isEmpty())
			return 'displayName';

		return true;
	}

	validate() {
		let result = this.validateMandatoryFields();
		if (result !== true) {
			console.log('Non-proper term: ', this);
			$.alert(result + ' should be not empty.');
			$('#' + NAMESPACE + result).focus();

			return false;
		}

		if (this.validateNameExpression() === false) {
			$.alert('Invalid term name. Please try another one.');
			$('#' + NAMESPACE + result).focus();
			return false;
		}

		return true;
	}

	/**
	 * Interface. Every subclasses must implement this interface.
	 *
	 * @param {String} forWhat
	 * @param {String} prefix
	 * @returns
	 */
	$render(forWhat, prefix) {
		console.log('Interface called: implement this interface!!!!');
		return;
	}

	$getLabelNode(forWhat, prefix) {
		let displayName = !!prefix
			? prefix + this.getLocalizedDisplayName()
			: this.getLocalizedDisplayName();

		if (
			forWhat === Constants.FOR_PREVIEW ||
			forWhat === Constants.FOR_EDITOR
		) {
			return FormUIUtil.$getLabelNode(
				displayName,
				this.mandatory,
				this.getLocalizedTooltip()
			);
		} else if (forWhat === Constants.FOR_SEARCH) {
			return FormUIUtil.$getLabelNode(
				displayName,
				false,
				this.getLocalizedTooltip()
			);
		} else if (forWhat === Constants.FOR_PDF_FORM) {
			let itemNo = '';

			return FormUIUtil.$getLabelNode(displayName, this.mandatory);
		}
	}

	$renderSearchItem() {
		let $item = $(
			'<span style="font-size:0.8rem;font-weight:600;display:inline-block;width:100%;padding:5px;">'
		);
		$item.text(this.getLocalizedDisplayName());

		let self = this;
		$item.on('click', function (event) {
			//let expanded = $item.data('expanded');
			//if( expanded )	return;
			if ($item.next()) $item.next().remove();

			$item.after(self.$getControlNode(Constants.FOR_SEARCH));
			//$item.data('expanded', true);
		});

		this.$rendered = FormUIUtil.$getSearchRowSection($item);

		return this.$rendered;
	}

	toJSON() {
		let json = new Object();

		/* required properties */
		json.termType = this.termType;
		json.termName = this.termName;
		json.termVersion = this.termVersion;
		json.displayName = this.displayName.toJSON();
		json.cssWidth = this.cssWidth;

		/* Never saved if undefined */
		if (this.abstractKey) json.abstractKey = true;
		if (!this.searchable) json.searchable = false;
		if (!this.downloadable) json.downloadable = false;
		if (Util.isNotEmptyString(this.synonyms)) json.synonyms = this.synonyms;
		if (this.mandatory) json.mandatory = true;
		if (this.disabled) json.disabled = true;
		if (Util.isSafeLocalizedObject(this.definition))
			json.definition = this.definition.toJSON();
		if (Util.isSafeLocalizedObject(this.tooltip))
			json.tooltip = this.tooltip.toJSON();
		if (Util.isSafeNumber(this.order)) json.order = this.order;
		if (this.dirty) json.dirty = this.dirty;
		if (Util.isNotEmptyString(this.masterTerm))
			json.masterTerm = this.masterTerm;
		if (this.isMemberOfGroup())
			json.groupTermId = this.groupTermId.toJSON();
		if (this.id) json.id = this.id;
		if (this.cssCustom) json.cssCustom = this.cssCustom;

		/* Keep this properties in lifetime */
		json.state = this.state;
		json.status = this.status;
		json.standard = this.standard;

		return json;
	}

	parse(json) {
		let unparsed = new Object();

		let self = this;
		Object.keys(json).forEach(function (key, index) {
			switch (key) {
				case 'id':
				case 'termType':
				case 'termName':
				case 'termVersion':
				case 'synonyms':
				case 'abstractKey':
				case 'searchable':
				case 'downloadable':
				case 'mandatory':
				case 'active':
				case 'order':
				case 'disabled':
				case 'masterTerm':
				case 'groupTermId':
				case 'displayName':
				case 'definition':
				case 'status':
				case 'tooltip':
				case 'cssWidth':
				case 'cssCustom':
				case 'state':
				case 'standard':
					self[key] = json[key];
					break;
				case 'dirty':
					break;
				default:
					unparsed[key] = json[key];
			}
		});

		return unparsed;
	}
}
