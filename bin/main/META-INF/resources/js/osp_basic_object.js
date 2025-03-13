(function(window) {
    'use strict';

    if (window.OSP) {
        if (OSP.Constants) return;
    } else
        window.OSP = {};

    OSP.Constants = {
        ACTION: 'action_',
        ARRAY_KEYS: 'arrayKeys_',
        ASSIGNED_PORTS: 'assignedPorts_',
        AVAILABLE_ANALYZERS: 'availableAnalyzers_',
        AVAILABLE_EDITORS: 'availableEditors_',
        CLASS_ID: 'classId_',
        IS_FLOW_LAYOUT: 'isFlowLayout_',
        COLUMNS: 'columns_',
        DEVIDER: 'deviders_',
        COMPARATIVE: 'comparative_',
        COMPARATIVE_PARAM: 'comparativeParam_',
        COMPARATIVE_VALUE: 'comparativeValue_',
        CONNECTIONS: 'connections_',
        CONNECTOR: 'connector_',
        CONTEXT: 'context_',
        CURRENT_PORTLET: 'currentPortlet_',
        CUSTOM_ID: 'customId_',
        REDIRECT_URL: 'redirectURL_',
        REDIRECT_NAME: 'redirectName_',
        BLOCK_INPUT_PORTS: 'blockInputPorts_',
        DASHBOARD_PORTLET: 'dashboardId_',
        DATA: 'data_',
        DATA_TYPE: 'dataType_',
        DATA_COLLECTION: 'dataCollection_',
        DATA_TYPE_UUID: 'dataTypeUuid_',
        DATA_UUID: 'dataUuid_',
        DEFAULT_ANALYZER: 'defaultAnalyzer_',
        DEFAULT_EDITOR: 'defaultEditor_',
        DESCRIPTION: 'description_',
        DESTINATION_PORT: 'destinationPort_',
        DIRTY: 'dirty_',
        DISPLAY: 'display_',
        DISPLAY_NAME: 'displayName_',
        DLENTRY_ID: 'dlEntryId_',
        EVENT_ENABLE: 'eventEnable_',
        EVENTS: 'events_',
        HANDSHAKE: 'handshake_',
        HEIGHT: 'height_',
        WIDTH: 'width_',
        LEFT: 'left_',
        TOP: 'top_',
        ICON: 'icon_',
        ID: 'id_',
        IMAGE: 'image_',
        INPUT_DATA: 'inputData_',
        INPUT_PORTS: 'inputPorts_',
        INPUTS: 'inputs_',
        ISEDIT: 'isEdit_',
        INSTANCE_ID: 'instanceId_',
        JOB_MONITOR_PORTLET: 'jobMonitorId_',
        JOB_STATUS_PORTLET: 'jobStatusId_',
        JOBS: 'jobs_',
        LAYOUT: 'layout_',
        LAYOUTS: 'layouts_',
        LAYOUT_NAME: 'layoutName_',
        LOCALIZED_TEXT: 'localizedText_',
        LOCATION: 'location_',
        LOG_DATA: 'logData_',
        LOG_PORTS: 'logPorts_',
        LOGS: 'logs_',
        MANDATORY: 'mandatory_',
        MAP: 'map_',
        NAME: 'name_',
        NAMESPACE: 'namespace_',
        ONE: 'one_',
        ORDER: 'order_',
        OUTPUT_DATA: 'outputData_',
        OUTPUT_PORTS: 'outputPorts_',
        OUTPUTS: 'outputs_',
        PAIRS: 'pairs_',
        PARENT: 'parent_',
        PATH: 'path_',
        PATH_TYPE: 'pathType_',
        PENDDING_EVENT: 'penddingEvent',
        PORT_NAME: 'portName_',
        PORT_NAMES: 'portNames_',
        PORTLET: 'portlet_',
        PORTLET_ID: 'portletId_',
        PORTLETS: 'portlets_',
        PREFERENCES: 'preferences_',
        PROCEED_CONDITIONS: 'proceedConditions_',
        RELATIVE: 'relative_',
        REPOSITORY_TYPE: 'repositoryType_',
        SAMPLE_UUID: 'sampleUuid_',
        SCIENCE_APP: 'scienceApp_',
        SCIENCE_APP_ID: 'scienceAppId_',
        SCIENCE_APP_INFO_PORTLET: 'scienceAppInfoId_',
        SCIENCE_APP_NAME: 'scienceAppName_',
        SCIENCE_APP_VERSION: 'scienceAppVersion_',
        SIMULATION_MONITOR_PORTLET: 'simulartionMonitorId_',
        SIMULATIONS: 'simulations_',
        SRC_PORT_NAME: 'sourcePortName_',
        STATUS: 'status_',
        STRUCTURE: 'structure_',
        STYLE: 'style_',
        SUBMIT: 'submit_',
        TARGET_LANGUAGE: 'targetLanguage_',
        TASKS: 'tasks_',
        TASK_UUID: 'taskUuid_',
        IS_STEP_LAYOUT: 'isStepLayout_',
        TEMPLATE_ID: 'templateId_',
        IS_PROVENANCE: 'isProvenance_',
        TITLE: 'title_',
        SEQ_NO: 'seqNo_',
        TWO: 'two_',
        TYPE: 'type_',
        VERSION: 'version_',
        UPDATES: 'updates_',
        URI: 'uri_',
        WINDOW_STATE: 'windowState_',
        WORKBENCH_ID: 'workbenchId_',
        WORKING_JOB: 'workingJob_',
        WORKING_JOB_UUID: 'workingJobUuid_',
        WORKING_SIMULATION: 'workingSimulation_',
        WORKING_SIMULATION_UUID: 'workingSimulationUuid_',
        MAX_CPU: 'maxCpu_',
        MIN_CPU: 'minCpu_',
        DEFAULT_CPU: 'defaultCpu_',
        //DataStructure
        //Parameter types
        STRING: 'string',
        NUMERIC: 'numeric',
        GROUP: 'group',
        COMMENT: 'comment',
        LIST: 'list',
        VECTOR: 'vector',
        //brace and space types
        SQUARE: "SQUARE",
        SQUARE_SPACE: "SQUARE_SPACE",
        ROUND: "ROUND",
        ROUND_SPACE: "ROUND_SPACE",

        //property names
        ACTIVE: 'active_',
        ACTIVATE_CONDITIONS: 'activateConditions_',
        ASSIGN_VALUE: 'assignValue_',
        AVAILABLE_LANGUAGE_IDS: 'availableLanguageIds_',
        BRACE_CHAR: 'braceChar_',
        COMMENT_CHAR: 'commentChar_',
        CONTROL_CHAR: 'controlChar_',
        DEFAULT_LANGUAGE_ID: 'defaultLanguageId_',
        DELIMITER: 'delimiter_',
        DIMENSION: 'dimension_',
        DISABLED: 'disabled_',
        LIST_ITEM: 'listItem_',
        LIST_ITEM_VALUE: 'listItemValue_',
        LIST_ITEMS: 'listItems_',
        LOWER_BOUNDARY: 'lowerBoundary_',
        LOWER_OPERAND: 'lowerOperand_',
        NAME_TEXT: 'nameText_',
        OPERAND: 'operand_',
        PARAMETER_DELIMITER: 'parameterDelimiter_',
        PARAMETER_FORM: 'parameterForm_',
        PARAMETER_NAME: 'parameterName_',
        PARAMETERS: 'parameters_',
        RANGE: 'range_',
        SAMPLE: 'sample_',
        SLICE_COUNT: 'sliceCount_',
        SLICE_MAX: 'sliceMax_',
        SLICE_VALUE: 'sliceValue_',
        SPACE: 'space_',
        SWEEP: 'sweep_',
        SWEEP_COUNT: 'sweepCount_',
        SWEEP_METHOD: 'sliceMethod_',
        SWEEP_MAX: 'sweepMax_',
        SWEEPABLE: 'sweepable_',
        SWEEPED: 'sweeped_',
        TEXT: 'text_',
        UPPER_BOUNDARY: 'upperBoundary_',
        UPPER_OPERAND: 'upperOperand_',
        VALUE: 'value_',
        UNIT: 'unit_',
        VALUE_DELIMITER: 'valueDelimiter_',
        VECTOR_FORM: 'vectorForm_',

        //Constants
        MAX_DIGIT: 1e15,

        //Workflow proceed actions
        PROCEED: 'proceed',
        UPDATE_PROCEED: 'updateProceed',
        REPEAT: 'repeat',
        UPDATE_REPEAT: 'updateRepeat',
        SUSPEND: 'suspend',
        STOP: 'stop',

        // Port type constants
        FILE: 'file',
        EXT: 'ext',
        FOLDER: 'folder',
        LOG: 'log',

        // Simulation and Job
        UUID: 'uuid_',
        APP_UUID: 'appUuid_',
        SCHEDULER_UUID: 'schedulerUuid_',
        SIMULATION_UUID: 'simaulationUuid_',
        AFTER_ANY: 'afterAny_',
        AFTER_OK: 'afterOK_',
        APP_BIN_PATH: 'appBinPath_',
        APP_EXE_FILE_NAME: 'appExeFileName_',
        JOB_TITLE: 'jobTitle_',
        NODES: 'nodes_',
        PROCESSORS_PER_NODE: 'processorsPerNode_',
        SUBMIT_ARGS: 'submitArgs_',
        CREATE_TIME: 'createTime_',
        QUEUE_NAME: 'queueName_',
        QUEUED_TIME: 'queuedTime_',
        NCORES: 'ncores_',
        MODIFIED_TIME: 'modifiedTime_',
        RUNTYPE: 'runType_',
        CURRENT_MANUAL_ID: 'currentManualId_',
        START_TIME: 'startTime_',
        END_TIME: 'endTime_',
        CLUSTER: 'cluster_',
        WORKING_DIR: 'workingDir_',
        PORTS_DATA: 'portsData_',

        verifyPathType: function(type) {
            if (!(type === 'file' || type === 'ext' || type === 'folder'))
                return false;
            else
                return true;
        },
        getBraceTypes: function() {
            var types = [];
            types.push(this.SQUARE);
            types.push(this.SQUARE_SPACE);
            types.push(this.ROUND);
            types.push(this.ROUND_SPACE);
            return types;
        },
        getParameterTypes: function() {
            var types = [];
            types.push(this.NUMERIC);
            types.push(this.VECTOR);
            types.push(this.STRING);
            types.push(this.LIST);
            types.push(this.GROUP);
            types.push(this.COMMENT);
            return types;
        },
        getDefinedPathTypes: function() {
            var types = [];
            types.push(this.FILE);
            types.push(this.EXT);
            types.push(this.FOLDER);
            return types;
        }
    }; // End of Constants

    OSP.Event = {
        OSP_CANCEL_CLICKED: 'OSP_CANCEL_CLICKED',
        OSP_CANCEL_JOB: 'OSP_CANCEL_JOB',
        OSP_CANCEL_SIMULATION: 'OSP_CANCEL_SIMULATION',
        OSP_COPY_JOB: 'OSP_COPY_JOB',
        OSP_REFRESH_URL_CHANGE: 'OSP_REFRESH_URL_CHANGE',
        OSP_CREATE_JOB: 'OSP_CREATE_JOB',
        OSP_CREATE_SIMULATION: 'OSP_CREATE_SIMULATION',
        OSP_DATA_CHANGED: 'OSP_DATA_CHANGED',
        OSP_DATA_LOADED: 'OSP_DATA_LOADED',
        OSP_DELETE_JOB: 'OSP_DELETE_JOB',
        OSP_DELETE_SIMULATION: 'OSP_DELETE_SIMULATION',
        OSP_DOWNLOAD_FILE: 'OSP_DOWNLOAD_FILE',
        OSP_ERROR: 'OSP_ERROR',
        OSP_EVENTS_REGISTERED: 'OSP_EVENTS_REGISTERED',
        OSP_FILE_DESELECTED: 'OSP_FILE_DESELECTED',
        OSP_FILE_SAVED_AS: 'OSP_FILE_SAVED_AS',
        OSP_FILE_SELECTED: 'OSP_FILE_SELECTED',
        OSP_HANDSHAKE: 'OSP_HANDSHAKE',
        OSP_INITIALIZE: 'OSP_INITIALIZE',
        OSP_JOB_CREATED: 'OSP_JOB_CREATED',
        OSP_JOB_DELETED: 'OSP_JOB_DELETED',
        OSP_JOB_SAVED: 'OSP_JOB_SAVED',
        OSP_JOB_SELECTED: 'OSP_JOB_SELECTED',
        OSP_JOB_STATUS_CHANGED: 'OSP_JOB_STATUS_CHANGED',
        OSP_LOAD_DATA: 'OSP_LOAD_DATA',
        OSP_DISABLE_CONTROLLS: 'OSP_DISABLE_CONTROLLS',
        OSP_LOAD_FILE: 'OSP_LOAD_FILE',
        OSP_LOAD_HTML: 'OSP_LOAD_HTML',
        OSP_OK_CLICKED: 'OSP_OK_CLICKED',
        OSP_PORT_SELECTED: 'OSP_PORT_SELECTED',
        OSP_PORT_STATUS_CHANGED: 'OSP_PORT_STATUS_CHANGED',
        OSP_READ_LOCAL_FILE: 'OSP_READ_LOCAL_FILE',
        OSP_READ_SERVER_FILE: 'OSP_READ_SERVER_FILE',
        OSP_READ_STRUCTURED_DATA_FILE: 'OSP_READ_STRUCTURED_DATA_FILE',
        OSP_REFRESH: 'OSP_REFRESH',
        OSP_REFRESH_SIMULATIONS: 'OSP_REFRESH_SIMULATIONS',
        OSP_REFRESH_JOBS: 'OSP_REFRESH_JOBS',
        OSP_REFRESH_JOB_STATUS: 'OSP_REFRESH_JOB_STATUS',
        OSP_REFRESH_OUTPUT_VIEW: 'OSP_REFRESH_OUTPUT_VIEW',
        OSP_REFRESH_PORTS_STATUS: 'OSP_REFRESH_PORTS_STATUS',
        OSP_REGISTER_EVENTS: 'OSP_REGISTER_EVENTS',
        OSP_REPORT_NAMESPACE: 'OSP_REPORT_NAMESPACE',
        OSP_REQUEST_APP_INFO: 'OSP_REQUEST_APP_INFO',
        OSP_REQUEST_DATA: 'OSP_REQUEST_DATA',
        OSP_REQUEST_DATA_STRUCTURE: 'OSP_REQUEST_DATA',
        OSP_REQUEST_DOWNLOAD: 'OSP_REQUEST_DOWNLOAD',
        OSP_REQUEST_FILE_PATH: 'OSP_REQUEST_FILE_PATH',
        OSP_REQUEST_FILE_URL: 'OSP_REQUEST_FILE_URL',
        OSP_REQUEST_JOB_UUID: 'OSP_REQUEST_JOB_UUID',
        OSP_REQUEST_MONITOR_INFO: 'OSP_REQUEST_MONITOR_INFO',
        OSP_REQUEST_OUTPUT_PATH: 'OSP_REQUEST_OUTPUT_PATH',
        OSP_REQUEST_PATH: 'OSP_REQUEST_PATH',
        OSP_REQUEST_PORT_INFO: 'OSP_REQUEST_PORT_INFO',
        OSP_REQUEST_SAMPLE_CONTENT: 'OSP_REQUEST_SAMPLE_CONTENT',
        OSP_REQUEST_SIMULATION_UUID: 'OSP_REQUEST_SIMULATION_UUID',
        OSP_REQUEST_SPREAD_TO_PORT: 'OSP_REQUEST_SPREAD_TO_PORT',
        OSP_REQUEST_UPLOAD: 'OSP_REQUEST_UPLOAD',
        OSP_REQUEST_WORKING_JOB_INFO: 'OSP_REQUEST_WORKING_JOB_INFO',
        OSP_RESPONSE_APP_INFO: 'OSP_RESPONSE_APP_INFO',
        OSP_RESPONSE_DATA: 'OSP_RESPONSE_DATA',
        OSP_RESPONSE_JOB_UUID: 'OSP_RESPONSE_JOB_UUID',
        OSP_RESPONSE_MONITOR_INFO: 'OSP_RESPONSE_MONITOR_INFO',
        OSP_RESPONSE_PORT_INFO: 'OSP_RESPONSE_PORT_INFO',
        OSP_RESPONSE_SIMULATION_UUID: 'OSP_RESPONSE_SIMULATION_UUID',
        OSP_SAMPLE_SELECTED: 'OSP_SAMPLE_SELECTED',
        OSP_SAVEAS_FILE: 'OSP_SAVEAS_FILE',
        OSP_SAVE_SIMULATION: 'OSP_SAVE_SIMULATION',
        OSP_SELECT_LOCAL_FILE: 'OSP_SELECT_LOCAL_FILE',
        OSP_SELECT_SERVER_FILE: 'OSP_SELECT_SERVER_FILE',
        OSP_SHOW_JOB_STATUS: 'OSP_SHOW_JOB_STATUS',
        OSP_SIMULATION_CREATED: 'OSP_SIMULATION_CREATED',
        OSP_SIMULATION_DELETED: 'OSP_SIMULATION_DELETED',
        OSP_SIMULATION_SAVED: 'OSP_SIMULATION_SAVED',
        OSP_SIMULATION_SELECTED: 'OSP_SIMULATION_SELECTED',
        OSP_SUBMIT_SIMULATION: 'OSP_SUBMIT_SIMULATION',
        OSP_SUBMIT_JOB: 'OSP_SUBMIT_JOB',
        OSP_UPLOAD_FILE: 'OSP_UPLOAD_FILE',
        OSP_UPLOAD_SELECTED: 'OSP_UPLOAD_SELECTED',
        OSP_RESPONSE_SAVE_SIMULATION_RESULT: 'OSP_RESPONSE_SAVE_SIMULATION_RESULT',
        OSP_RESPONSE_CREATE_SIMULATION_RESULT: 'OSP_RESPONSE_CREATE_SIMULATION_RESULT',
        OSP_RESPONSE_DELETE_SIMULATION_RESULT: 'OSP_RESPONSE_DELETE_SIMULATION_RESULT',
        OSP_RESPONSE_CREATE_SIMULATION_JOB_RESULT: 'OSP_RESPONSE_CREATE_SIMULATION_JOB_RESULT',
        OSP_RESPONSE_DELETE_SIMULATION_JOB_RESULT: 'OSP_RESPONSE_DELETE_SIMULATION_JOB_RESULT',
        OSP_RESPONSE_CANCLE_SIMULATION_JOB_RESULT: 'OSP_RESPONSE_CANCLE_SIMULATION_JOB_RESULT',
        OSP_REQUEST_SIMULATION_MODAL: 'OSP_REQUEST_SIMULATION_MODAL',
        OSP_RESPONSE_SIMULATION_MODAL: 'OSP_RESPONSE_SIMULATION_MODAL',
        OSP_REQUEST_SIMULATION_EDIT_VIEW: 'OSP_REQUEST_SIMULATION_EDIT_VIEW',
        OSP_RESPONSE_SIMULATION_EDIT_VIEW: 'OSP_RESPONSE_SIMULATION_EDIT_VIEW',
        OSP_REQUEST_DELETE_JOB_VIEW: 'OSP_REQUEST_DELETE_JOB_VIEW',
        OSP_REPONSE_DELETE_JOB_VIEW: 'OSP_REPONSE_DELETE_JOB_VIEW',
        OSP_REQUEST_JOB_RESULT_VIEW: 'OSP_REQUEST_JOB_RESULT_VIEW',
        OSP_RESPONSE_JOB_RESULT_VIEW: 'OSP_RESPONSE_JOB_RESULT_VIEW',
        OSP_REQUEST_NEW_JOB_VIEW: 'OSP_REQUEST_NEW_JOB_VIEW',
        OSP_RESPONSE_NEW_JOB_VIEW: 'OSP_RESPONSE_NEW_JOB_VIEW',
        OSP_REQUEST_FLOW_LAYOUT_CODE_UPDATE: 'OSP_FLOW_LAYOUT_CODE_UPDATE',
        OSP_RESPONSE_FLOW_LAYOUT_CODE_UPDATE: 'OSP_FLOW_LAYOUT_CODE_UPDATE',
        OSP_RESPONSE_SUBMIT_JOB_RESULT: 'OSP_RESPONSE_SUBMIT_JOB_RESULT',
        OSP_REQUEST_JOB_LOG_VIEW: 'OSP_REQUEST_JOB_LOG_VIEW',
        OSP_RESPONSE_JOB_LOG_VIEW: 'OSP_RESPONSE_JOB_LOG_VIEW',
        OSP_REQUEST_COLLECTION_VIEW: 'OSP_REQUEST_COLLECTION_VIEW',
        OSP_RESPONSE_COLLECTION_VIEW: 'OSP_RESPONSE_COLLECTION_VIEW',
        OSP_REQUEST_JOB_KEY: 'OSP_REQUEST_JOB_KEY',
        OSP_RESPONSE_JOB_KEY: 'OSP_RESPONSE_JOB_KEY',

        reportProcessStatus: function(portletId, event, srcEvent, srcEventData, status) {
            var eventData = {
                portletId: portletId,
                targetPortlet: srcEventData.portletId,
                sourceEvent: srcEvent,
                sourceData: srcEventData,
                processStatus: status,
            };

            Liferay.fire(event, eventData);
        },
        reportDataChanged: function(portletId, targetId, data) {
            var eventData = {
                portletId: portletId,
                targetPortlet: targetId,
                data: data
            };

            Liferay.fire(OSP.Event.OSP_DATA_CHANGED, eventData);
        },

        reportFileSelected: function(portletId, targetId, data) {
            var eventData = {
                portletId: portletId,
                targetPortlet: targetId,
                data: data
            };

            console.log('FileSelected++++++++++++====================');
            console.log(eventData);
            Liferay.fire(OSP.Event.OSP_FILE_SELECTED, eventData);
        },

        reportFileDeselected: function(portletId, targetId, data) {
            var eventData = {
                portletId: portletId,
                targetPortlet: targetId,
                data: data
            };

            Liferay.fire(OSP.Event.OSP_FILE_DESELECTED, eventData);
        },

        responseDataToRequest: function(portletId, data, srcEventData) {
            var eventData = {
                portletId: portletId,
                targetPortlet: srcEventData.portletId,
                sourceEvent: OSP.Event.OSP_REQUEST_DATA,
                sourceData: srcEventData,
                data: data
            };

            Liferay.fire(OSP.Event.OSP_RESPONSE_DATA, eventData);
        },
        reportError: function(portletId, targetPortlet, message) {
            var eventData = {
                portletId: portletId,
                targetPortlet: targetPortlet,
                message: message
            };

            Liferay.fire(OSP.Event.OSP_ERROR, eventData);
        },
        stripNamespace: function(namespace) {
            var id = namespace.slice(namespace.indexOf('_') + 1);
            return id.slice(0, id.lastIndexOf('_'));
        },
        getNamespace: function(instanceId) {
            return '_' + instanceId + '_';
        }

    }; // End of Event

    OSP.Enumeration = {
        WorkbenchType: {
            SIMULATION_WITH_APP: 'SIMULATION_WITH_APP',
            SIMULATION_RERUN: 'SIMULATION_RERUN',
            SIMULATION_WORKFLOW: 'SIMULATION_WORKFLOW',
            SIMULATION_APP_TEST: 'SIMULATION_APP_TEST',
            SIMULATION_WORKFLOW_TEST: 'SIMULATION_WORKFLOW_TEST',
            ANALYSIS_RERUN_APP: 'SIMULATION_APP',
            ANALYSIS_RERUN_WORKFLOW: 'SIMULATION_WORKFLOW',
            MONITORING_ANALYSIS: 'MONITORING_ANALYSIS',
            MONITORING_RERUN_WORKFLOW: 'MONITORING_RERUN_WORKFLOW',
            ANALYSYS: 'ANALYSYS',
            CURRICULUM: 'CURRICULUM',
            VIRTUAL_LAB: 'VIRTUAL_LAB',
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
        PathType: {
            NONE: 'none',
            DLENTRY_ID: 'dlEntryId',
            FILE_CONTENT: 'fileContent',
            STRUCTURED_DATA: 'structuredData',
            URL: 'url',
            FILE: 'file',
            FOLDER: 'folder',
            EXT: 'ext',
            CONTEXT: 'context',
            SAMPLE: 'sample'
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
            PROVENANCE: 'PROVENANCE',
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
            APP_INFO: 'appInfo',
            DASHBOARD: 'dashboard',
            SIMULATION_MONITOR: 'simulationMonitor',
            JOB_MONITOR: 'jobMonitor',
            JOB_STATUS: 'jobStatus',
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
            STATIC_SOLVER: 'ss',
            JAVASCRIPT_SOLVER: 'js',
            DYNAMIC_SOLVER: 'ds',
            STATIC_CONVERTER: 'sc',
            DYNAMIC_CONVERTER: 'dc',
            EDITOR: 'e',
            ANALYZER: 'a',
            EDITABLE_ANALYZER: 'ea'
        }
    }; // End of Enumeration

    OSP.Util = {
        guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char) {
                var random = Math.random() * 16 | 0,
                    value = char === 'x' ? random : (random & 0x3 | 0x8);
                return value.toString(16);
            })
        },
        safeFloatSum: function(x, y) {
            return (parseFloat(x) * OSP.Constants.MAX_DIGIT +
                    parseFloat(y) * OSP.Constants.MAX_DIGIT) /
                OSP.Constants.MAX_DIGIT;
        },
        safeFloatSubtract: function(x, y) {
            return (parseFloat(x) * OSP.Constants.MAX_DIGIT -
                    parseFloat(y) * OSP.Constants.MAX_DIGIT) /
                OSP.Constants.MAX_DIGIT;
        },
        isInteger: function(num) {
            return num % 1 == 0;
        },
        isExponetioal: function(numStr) {
            if (numStr.search(/[eEdD]/i) == -1)
                return false;
            else
                return true;
        },
        toFloatString: function(num, exponential) {
            if (exponential)
                return num.toExponential();
            else
                return num.toString();
        },
        toLocalizedXml: function(jsonObject, availableLanguageIds, defaultLanguageId) {
            if (!availableLanguageIds) availableLanguageIds = '';
            if (!defaultLanguageId) defaultLanguageId = '';

            var xml = '<?xml version=\'1.0\' encoding=\'UTF-8\'?>';
            xml += '<root available-locales=\'';
            xml += availableLanguageIds + '\' ';
            xml += 'default-locale=\'' + defaultLanguageId + '\'>';

            for (var languageId in jsonObject) {
                var value = jsonObject[languageId];
                xml += '<display language-id=\'' + languageId + '\'>' + value +
                    '</display>';
            }
            xml += '</root>';

            return xml;
        },
        toJSON: function(obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        isEmpty: function(obj) {
            if (obj == null) return true;
            if (obj.length == 0)
                return true;

            if (typeof obj !== 'object') return false;

            for (var key in obj) {
                if (OSP.Util.isEmpty(obj[key]) == false) return false;
            }

            return true;
        },
        convertToPath: function(filePath) {
            var path = new OSP.Path();
            if (!filePath) {
                path.parent('');
                path.name('');
                return path;
            }

            filePath = this.removeEndSlashes(filePath);

            var lastIndexOfSlash = filePath.lastIndexOf('/');
            if (lastIndexOfSlash < 0) {
                path.parent('');
                path.name(filePath);
            } else {
                path.parent(filePath.slice(0, lastIndexOfSlash));
                path.name(filePath.slice(lastIndexOfSlash + 1));
            }

            return path;
        },
        extractFileName: function(filePath) {
            var path = this.convertToPath(filePath);
            return path.name();
        },
        removeEndSlashes: function(strPath) {
            var index = strPath.indexOf('/');
            if (index == 0)
                strPath = strPath.slice(1);

            index = strPath.lastIndexOf('/');
            if (index === strPath.length - 1)
                strPath = strPath.slice(0, index);

            return strPath;
        },
        removeArrayElement: function(array, index) {
            array.splice(index, 1);
            return array;
        },
        isBrowserEdge: function() {
            var ua = navigator.userAgent,
                tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                //return {name:'IE',version:(tem[1]||'')};
                return false;
            }

            return true;
        },
        addFirstArgument: function(argument, args) {
            var newArgs = [];
            for (var i = 0; i < args.length; i++) {
                newArgs.push(args[i]);
            }
            newArgs.unshift(argument);
            return newArgs;
        },
        mergePath: function(parent, child) {
            if (!parent && !child) return '';
            if (!parent)
                return child;
            if (!child)
                return parent;

            return parent + '/' + child;
        },
        getBaseDir: function(userScreenName) {
            if (userScreenName === 'edison' || userScreenName === 'edisonadm')
                return '';
            else
                return userScreenName;
        },
        blockStart: function($block, $message) {
            $block.block({
                message: $message,
                css: { border: '3px solid #a00' }
            });
        },
        blockEnd: function($block) {
            $block.unblock();
        },
        evalHttpParamSeparator: function(baseURL) {
            var sep = (baseURL.indexOf('?') > -1) ? '&' : '?';
            return sep;
        },
        convertJobStatus: function(status) {
            switch (status) {
                case 0:
                    return "INITIALIZED";
                case 1701001:
                    return "Unknown";
                case 1701002:
                    return "INITIALIZE_FAILED";
                case 1701003:
                    return "INITIALIZED";
                case 1701004:
                    return "SUBMISSION_FAILED";
                case 1701005:
                    return "QUEUED";
                case 1701006:
                    return "RUNNING";
                case 1701007:
                    return "SUSPEND_REQUESTED";
                case 1701008:
                    return "SUSPENDED";
                case 1701009:
                    return "CANCEL_REQUESTED";
                case 1701010:
                    return "CANCELED";
                case 1701011:
                    return "SUCCESS";
                case 1701012:
                    return "FAILED";
                default:
                    return "Unknown";
            }
        }
    }; // End of OSP.Util

    OSP.Debug = {
        eventTrace: function(message, event, eventData) {
            console.log('/+++++++++' + message + '++++++++/');
            console.log(event);
            console.log(eventData);
            console.log('/++++++++++++++++++++++++++/');
        }
    }; // End of OSP.Debug

})(window);