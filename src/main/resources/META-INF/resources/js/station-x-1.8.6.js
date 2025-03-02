let StationX = function ( NAMESPACE, DEFAULT_LANGUAGE, CURRENT_LANGUAGE, AVAILABLE_LANGUAGES ) {

	let MULTI_LANGUAGE = true;
	if( AVAILABLE_LANGUAGES.length < 2 ){
		MULTI_LANGUAGE = false;
	};

	let Debug = {
		eventTrace: function(message, event, dataPacket) {
            console.log('/+++++++++' + message + '++++++++/');
            console.log(event);
            console.log(dataPacket);
            console.log('/++++++++++++++++++++++++++/');
        }
	};
	
	let Util = {
		isEmptyObject: function(obj){
			if( obj === null || obj === undefined )	return true;
			if( typeof obj.isEmpty === 'function' )	return obj.isEmpty();

			if( typeof obj === 'number' || typeof obj === 'boolean' )	return false;
			if( typeof obj === 'string' ){
				if( obj === '' )	return true;
				else	return false;
			}
			if( obj instanceof Array ){
				if( obj.length === 0 )	return true;
				else	return false;
			} 

			return false;
		},
		deepEqualObject: function( obj1, obj2){
			let result = true;

			if( obj1 === obj2 ){
				return true;
			}
			else if( (Util.isNotNull(obj1) && Util.isNull(obj2)) ||
					 (Util.isNull(obj1) && Util.isNotNull(obj2)) ){
				return false;
			}

			const keys1 = Object.keys(obj1);
			const keys2 = Object.keys(obj2);

			if( keys1.length !== keys2.length ){
				return false;
			}

			keys1.every(key=>{
				const val1 = obj1[key];
				const val2 = obj2[key];
				const areObjects = Util.isObject(val1) && Util.isObject(val2);

				if( (areObjects && !Util.deepEqualObject(val1, val2)) ||
					(!areObjects && val1 !== val2) ){
					result = false;
					return Constants.STOP_EVERY;
				}

				return Constants.CONTINUE_EVERY;
			});

			return result;
		},
		getTokenArray( sentence, regExpr=/\s+/  ){
			return sentence.trim().split(regExpr);
		},
		getFirstToken( sentence ){
			let tokens = sentence.trim().split( /\s+/ );

			return tokens[0];
		},
		getLastToken( sentence ){
			let tokens = sentence.trim().split( /\s+/ );

			return tokens[tokens.length - 1];
		},
		split: function( str, regExpr ){
			let words = str.split( regExpr );
			words = words.filter( word => word );

			return words;
		},
		toDateTimeString: function(value){
			if( !value ){
				return '';
			}

			let date = new Date( Number( value ) );
			let year = date.getFullYear();
			let month = (date.getMonth()+1);
			let day = date.getDate();
			let hour = date.getHours().toLocaleString(undefined, {minimumIntegerDigits:2});
			let minuite = date.getMinutes().toLocaleString(undefined, {minimumIntegerDigits:2});
			let dateAry = [year, String(month).padStart(2, '0'), String(day).padStart(2, '0')];
			let timeAry = [String(hour).padStart(2, '0'), String(minuite).padStart(2, '0')];
			return dateAry.join('/') + ' ' + timeAry.join(':');
		},
		toDateString: function( value ){
			if( !value ){
				return '';
			}

			let date = new Date( Number( value ) );
			let dateAry = [date.getFullYear(), String(date.getMonth()+1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')];

			return dateAry.join('/');
		},
        isEmpty: function(obj) {
            return Util.isEmptyObject(obj);
        },
		isNotEmpty: function(obj){
			return !Util.isEmptyObject(obj);
		},
		isEmptyString: function(str){
			return (typeof str === 'string') && str === '';
		},
		isNotEmptyString: function(str){
			return (typeof str === 'string') && (str.length > 0);
		},
		isNotNull: function(obj){
			return obj !== null;
		},
		isNull: function(obj){
			return obj === null;
		},
		isObject: function(obj){
			return typeof obj === 'object';
		},
		isNonEmptyArray: function( array ){
			if( Array.isArray(array) && array.length  ){
				for( let index=0; index < array.length; index++ ){
                    let element = array[index];
                    
					if( !Array.isArray(element) && (!!element || element === 0) )	return true;
					else if( Array.isArray(element) ){
						if( this.isNonEmptyArray( element ) ) return true;
					}
				}
                
                return false;
			}
			else{
				return false;
			}
		},
		isEmptyArray: function(ary){
			return !this.isNonEmptyArray(ary);
		},
		isSafeNumber: function( value ){
			return Number(value) === value;
		},
		isSafeBoolean: function( value){
			return typeof value === 'boolean';
		},
		isSafeLocalizedObject: function(val){
			return (val instanceof LocalizedObject) ? true : false;
		},
		toSafeNumber: function( value, defaultVal ){
			if( this.isSafeNumber( value ) )	return value;

			if( Util.isEmpty(value) )	return undefined;

			let number = Number(value);
			if( isNaN(number) )	return defaultVal;

			return number;
		},
		toSafeBoolean: function( val, defaultVal ){
			let bool =  Util.isNotEmptyString(val) ? JSON.parse(val) : val;

			return (typeof bool === 'boolean') ?  bool : defaultVal;
		},

		toSafeObject: function( val, defaultVal ){
			if( !$.isEmptyObject(val) )	return val;

			return defaultVal;
		},
		toSafeLocalizedObject: function( val){
			let obj;
			if( val instanceof LocalizedObject ){
				return val;
			}
			else{
				obj = Util.isNotEmptyString(val) ? JSON.parse(val) : val;
				return new LocalizedObject(obj);
			}
		},
		toSafeTermId: function( val ){
			let obj;
			if( val instanceof TermId ){
				return val;
			}
			else{
				obj = Util.isNotEmptyString(val) ? JSON.parse(val) : val;
				return new TermId(obj.name, obj.version);
			}
		},
		guid: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(char) {
                var random = Math.random() * 16 | 0,
                    value = char === 'x' ? random : (random & 0x3 | 0x8);
                return value.toString(16);
            })
        },
        safeFloatSum: function(x, y) {
            return (parseFloat(x) * Constants.MAX_DIGIT +
                    parseFloat(y) * Constants.MAX_DIGIT) /
                Constants.MAX_DIGIT;
        },
        safeFloatSubtract: function(x, y) {
            return (parseFloat(x) * Constants.MAX_DIGIT -
                    parseFloat(y) * Constants.MAX_DIGIT) /
                Constants.MAX_DIGIT;
        },
		isString: function( str ){
			return typeof str === 'string' && str.length > 0;
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
        convertToPath: function(filePath) {
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
        extractFileName: function(filePath) {
            var path = this.convertToPath(filePath);
            return path.name();
        },
        removeEndSlashes: function(strPath) {
        	if(!strPath){return strPath;}
        	
            while( strPath.startsWith('/') ){
		        strPath = strPath.slice(1);
	        }
	
	        while( strPath.endsWith('/') ){
		        strPath = strPath.slice(0, strPath.length-1 );
	        }
	
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
            parent = this.removeEndSlashes(parent);
            child = this.removeEndSlashes(child);
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
        getJobStatusValue:function(code){
        	var map = Enumeration.WorkflowStatus[code.toUpperCase()];
        	if(typeof map=='undefined'){
        		console.log('getJobStatusValue_No CODE',code);
        		return null;
        	}else{
        		return map.value;
        	}
        },
        getJobStatusCode:function(value){
        	var map = Enumeration.WorkflowStatus;
        	for(var codeKey in map){
        		if(map[codeKey].value==value){
        			return map[codeKey].code;
        		}
        	}
        	return null;
        },
        getLocalFile: function( anchor ){
            return $(anchor)[0].files[0];
        },
        getLocalFileName: function( anchor ){
            let fileName = $(anchor).val();
			
			let slashIndex = fileName.lastIndexOf('\\');
			if( slashIndex < 0 )
                slashIndex = fileName.lastIndexOf('/');
                 
			return fileName.slice(slashIndex+1);
        },
        randomString: function( length, code ){
            let mask = '';
            if (code.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
            if (code.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (code.indexOf('1') > -1) mask += '0123456789';
            if (code.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
            let result = '';
            for (let i = length; i > 0; --i){
                result += mask[Math.floor(Math.random() * mask.length)];
            } 
            return result;
        },
		createFormData: function( jsonData ){
            let formData = new FormData();
            for( let key in jsonData ){
                formData.append( NAMESPACE+key, jsonData[key] );
            }

            return formData;
        },
		readFile( file ){
			let loader = new FileReader();
			let def = $.Deferred();
			let promise = def.promise();

			//--- provide classic deferred interface
			loader.onload = function (e) { def.resolve(e.target.result); };
			loader.onprogress = loader.onloadstart = function (e) { def.notify(e); };
			loader.onerror = loader.onabort = function (e) { def.reject(e); };
			promise.abort = function () { return loader.abort.apply(loader, arguments); };

			loader.readAsBinaryString(file);

			return promise;
		},
		buildMultipart( formData ){
			let partKey, crunks = [], bound = false;
			while (!bound) {
				bound = $.md5 ? $.md5(new Date().valueOf()) : (new Date().valueOf());
				for (partKey in formData){
					console.log('formData[partKey]:', partKey, formData[partKey]);
					if (~formData[partKey].indexOf(bound)) { 
						bound = false;
						continue; 
					}
				} 
			}
		
			for (let partKey = 0, l = formData.length; partKey < l; partKey++){
				if (typeof(formData[partKey].value) !== "string") {
					crunks.push("--"+bound+"\r\n"+
						"Content-Disposition: form-data; name=\""+formData[partKey].name+"\"; filename=\""+formData[partKey].value[1]+"\"\r\n"+
						"Content-Type: application/octet-stream\r\n"+
						"Content-Transfer-Encoding: binary\r\n\r\n"+
						formData[partKey].value[0]);
				}else{
					crunks.push("--"+bound+"\r\n"+
						"Content-Disposition: form-data; name=\""+formData[partKey].name+"\"\r\n\r\n"+
						formData[partKey].value);
				}
			}
		
			return {
				bound: bound,
				data: crunks.join("\r\n")+"\r\n--"+bound+"--"
			};
		},
		uploadFile( url, file, dataObj=null, asTempFile=false ){
			let deferred = $.Deferred(), promise = deferred.promise();

			Util.readFile( file ).done( fileData => {
				if( Util.isEmpty(dataObj) )	dataObj = new Object();
				dataObj.asTempFile = asTempFile;
				dataObj.file = [fileData, file.name];
				console.log('Finish read a file: ', dataObj );

				let _formData = Util.createFormData( dataObj );

				
				console.log('_formData:', _formData);
				let multiPart = Util.buildMultipart(_formData);
				
				let req = $.ajax({
						url: url,
						type: 'POST',
						dataType: 'json',
						data:_formData,
						processData: false,
						contentType: "multipart/form-data; boundary="+multiPart.bound,
						xhr: function() {
							let xhr = $.ajaxSettings.xhr();
							if (xhr.upload) {
								xhr.upload.addEventListener('progress', function(event) {
									let percent = 0;
									//let position = event.loaded || event.position; /*event.position is deprecated*/
									let position = event.loaded;
									let total = event.total;
									if (event.lengthComputable) {
										percent = Math.ceil(position / total * 100);
										deferred.notify(percent);
									}                    
								}, false);
							}
							return xhr;
						}
				});

				req.done(function(){ deferred.resolve.apply(deferred, arguments); })
				.fail(function(){ deferred.reject.apply(deferred, arguments); });

				promise.abort = function(){ return req.abort.apply(req, arguments); }

			});

			return promise;
        },
		conformInRange: function( from, to, data ){
			if( (typeof from === "number") && (typeof to === "number") ){
				return data >= from && data <= to;
			}
			else if( (typeof from !== "number") && (typeof to === "number") ){
				return data <= to;
			}
			else if( (typeof from === "number") && (typeof to !== "number") ){
				return data >= from;
			}
		},
		createEventDataPacket(sourcePortlet, targetPortlet){
			return new EventDataPacket( sourcePortlet, targetPortlet );
		},
		fire: function( event, dataPacket ){
			Liferay.fire( event, {dataPacket: dataPacket} );
		}
	};
	
	let UIUtil = {
			getMandatorySpan: function(){
				let $span = $('<span>').attr({
					'class': 'reference-mark text-warning'
				});
				let $svg = $('<svg>').attr({
					'class': 'lexicon-icon lexicon-icon-asterisk',
					'focusable': false,
					'role': 'presentation',
					'viewBox': '0 0 512 512'
				});
				$span.append( $svg );
				
				$svg.append( $('<path>').attr({
					'd': 'M323.6,190l146.7-48.8L512,263.9l-149.2,47.6l93.6,125.2l-104.9,76.3l-96.1-126.4l-93.6,126.4L56.9,435.3l92.3-123.9L0,263.8l40.4-122.6L188.4,190v-159h135.3L323.6,190L323.6,190z',
					'class': 'lexicon-icon-outline'
				}) );

				return $span;
			},
			getTooltipSpan: function( tooltip ){
				
			}
	};

	let Enumeration = {
        VERSION: '20190228-GA01',
        
    };
	
	class DataType {
		static DEFAULT_HAS_DATA_STRUCTURE = false;
		static DEFAULT_SHOW_TOOLTIP = true;
		
		#dataTypeId;
		#dataTypeName;
		#dataTypeVersion;
		#dataStructure;

		get dataTypeId(){return this.#dataTypeId;}
		set dataTypeId( id ){
			let safeId = Util.toSafeNumber(id, this.dataTypeId);
			if( isNaN(safeId) )	return;

			this.#dataTypeId = safeId;
		}
		get dataTypeName(){return this.#dataTypeName;}
		set dataTypeName( name ){this.#dataTypeName=name;}

		constructor( dataTypeId, dataTypeName, dataTypeVersion ){
			this.dataTypeId = dataTypeId;
			this.dataTypeName = dataTypeName;
			this.dataTypeVersion = dataTypeVersion;
			this.hasDataStructure = DataType.DEFAULT_HAS_DATA_STRUCTURE;
			this.showTooltip = DataType.DEFAULT_SHOW_TOOLTIP;
		}
	}
	
	const TermTypes = {
		STRING : 'String',
		NUMERIC : 'Numeric',
		INTEGER : 'Integer',
		BOOLEAN : 'Boolean',
		LIST : 'List',
		MATRIX : 'Matrix',
		FILE : 'File',
		ARRAY : 'Array',
		ADDRESS : 'Address',
		DATE : 'Date',
		PHONE : 'Phone',
		EMAIL : 'EMail',
		GROUP : 'Group',
		GRID: 'Grid',
		COMMENT : 'Comment',
		
		DEFAULT_TERM_TYPE: 'String',

		CREATE_TERM: function( jsonTerm ){
			switch( jsonTerm.termType ){
			case 'String':
				return new StringTerm( jsonTerm );
			case 'Numeric':
				return new NumericTerm( jsonTerm );
			case 'Integer':
				return new IntegerTerm( jsonTerm );
			case 'List':
				return new ListTerm( jsonTerm );
			case 'Boolean':
				return new BooleanTerm( jsonTerm );
			case 'EMail':
				return new EMailTerm( jsonTerm );
			case 'Date':
				return new DateTerm( jsonTerm );
			case 'Address':
				return new AddressTerm( jsonTerm );
			case 'Phone':
				return new PhoneTerm( jsonTerm );
			case 'Matrix':
				return new MatrixTerm( jsonTerm );
			case 'File':
				return new FileTerm( jsonTerm );
			case 'DataLink':
				return new FileTerm( jsonTerm );
			case 'Group':
				return new GroupTerm( jsonTerm );
			case 'Grid':
				return new GridTerm( jsonTerm );
			default:
				return new StringTerm( jsonTerm );
			}
		},

		TERM_TYPES : [ 
				'String',
				'Numeric',
				'Boolean',
				'List',
				'Matrix',
				'File',
				'Array',
				'Address',
				'Date',
				'Phone',
				'EMail',
				'Group',
				'Grid',
				'Comment'
			]
	};

	const DataStructureAttributes = {
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
	
	const TermAttributes = {
		 ABSTRACT_KEY: 'abstractKey',
		 ACTIVE : 'active',
		 ALLOWED_EXTENSIONS: 'allowedExtensions',
		 AVAILABLE_LANGUAGE_IDS : 'availableLanguageIds',
		 COLUMNS: 'columns',
		 COLUMN_WIDTH: 'columnWidth',
		 COUNTRY_CODE : 'countryCode',
		 CSS_WIDTH : 'cssWidth',
		 CSS_CUSTOM : 'cssCustom',
		 DATATYPE_NAME : 'dataTypeName',
		 DATATYPE_VERSION : 'dataTypeVersion',
		 DEFINITION : 'definition',
		 DEFAULT_LANGUAGE_ID : 'defaultLanguageId',
		 DEFAULT_LOCALE : 'defaultLocale',
		 DIMENSION_X : 'dimensionX',
		 DIMENSION_Y : 'dimensionY',
		 DISABLED : 'disabled',
		 DISPLAY_NAME : 'displayName',
		 DISPLAY_STYLE : 'displayStyle',
		 DOWNLOADABLE : 'downloadable',
		 ELEMENT_TYPE : 'elementType',
		 ENABLE_TIME: 'enableTime',
		 END_YEAR: 'endYear',
		 EXPANDED: 'expanded',
		 FALSE_LABEL : 'falseLabel',
		 FILE_ID : 'fileId',
		 FORMAT : 'format',
		 GRID_COLUMNS: 'gridColumns',
		 INPUT_SIZE: 'inputSize',
		 ITEM_DISPLAY_NAME : 'itemDisplayName',
		 LINE_BREAK: 'lineBreak',
		 LIST_ITEM : 'listItem',
		 LIST_ITEM_VALUE : 'listItemValue',
		 LIST_ITEMS : 'listItems',
		 MANDATORY : 'mandatory',
		 MASTER_TERM : 'masterTerm',
		 MAX_BOUNDARY : 'maxBoundary',
		 MAX_LENGTH :'maxLength',
		 MAX_VALUE :'maxValue',
		 MIN_BOUNDARY : 'minBoundary',
		 MIN_LENGTH :'minLength',
		 MIN_VALUE :'minValue',
		 MULTIPLE:'multiple',
		 MULTIPLE_LINE :'multipleLine',
		 NUMERIC_PLACE_HOLDER : 'numericPlaceHolder',
		 OPTION_LABEL: 'optionLabel',
		 OPTION_VALUE: 'optionValue',
		 OPTIONS: 'options',
		 OPTION_SELECTED: 'optionSelected',
		 ORDER : 'order',
		 PATH : 'path',
		 PATH_TYPE : 'pathType',
		 PLACE_HOLDER : 'placeHolder',
		 RANGE : 'range',
		 REF_DATATYPES : 'refDataTypes',
		 REF_DATABASES : 'refDatabases',
		 ROWS: 'rows',
		 SEARCHABLE: 'searchable',
		 SLAVE_TERMS: 'slaveTerms',
		 START_YEAR: 'startYear',
		 SWEEPABLE : 'sweepable',
		 SYNONYMS : 'synonyms',
		 TERM_ID : 'termId',
		 TERM_NAME : 'termName',
		 TERM_TYPE : 'termType',
		 TERM_VERSION : 'termVersion',
		 TEXT : 'text',
		 TOOLTIP : 'tooltip',
		 TRUE_LABEL : 'trueLabel',
		 UNCERTAINTY : 'uncertainty',
		 UNCERTAINTY_VALUE : 'uncertaintyValue',
		 UNIT : 'unit',
		 URI : 'uri',
		 URI_TYPE : 'uriType',
		 URL : 'url',
		 VALIDATION_RULE  : 'validationRule',
		 VALUE : 'value',
		 VALUE_DELIMITER : 'valueDelimiter',
		 VERSION : 'version'
	};

	class TermId{
		#name;
		#version;

		get name(){ return this.#name; }
		set name(val){ this.#name = val; }
		get version(){ return this.#version; }
		set version(val){ this.#version = val; }

		constructor( name, version ){
			this.name = Util.isNotEmptyString(name) ? name : '';
			this.version = Util.isNotEmptyString(version) ? version : '';
		}
		
		isEmpty(){
			return Util.isEmptyString(this.name);
		}
		
		isNotEmpty(){
			return Util.isNotEmptyString(this.name);
		}

		sameWith( anotherId ) {
			if( anotherId.isEmpty() && this.isEmpty() ){
				return true;
			}
			else if( anotherId.name === this.name && anotherId.version === this.version ){
				return true;
			}
			else{
				return false;
			}
		}

		toJSON(){
			return {
				name: this.name,
				version: this.version
			};
		}
	}
	
	class LocalizationUtil {
		constructor(){}
		
		static getSelectedLanguage( inputId ){
			if( MULTI_LANGUAGE === false ){
				return CURRENT_LANGUAGE;
			}
			
			let baseId = NAMESPACE + inputId;
			const $languageContainer = $('#'+baseId+'BoundingBox');
			const selectedLanguage = $languageContainer.find('.btn-section').text().replace('-', '_');
			
			return selectedLanguage;
		}

		static getLocalizedXML( fieldName, localizedMap ){
			let xml = 
					'<?xml version=\'1.0\' encoding=\'UTF-8\'?>' +
						'<root ' + 
								'available-locales="' + Object.keys( localizedMap ) + '" ' +
								'default-locale="' + DEFAULT_LANGUAGE + '">';
			Object.keys( localizedMap ).forEach((locale)=>{
				xml += '<' + fieldName + ' language-id="' + locale +'">' + localizedMap[locale] + '</' + fieldName + '>';
			});

			xml += '</root>';

			return xml;
		}
		
		static getLocalizedInputValue( inputId ){
			let baseId = NAMESPACE + inputId;
			const selectedLanguage = LocalizationUtil.getSelectedLanguage( inputId ).trim();
			
			return AVAILABLE_LANGUAGES.reduce( ( obj, locale ) => {
				let localizedInputId = NAMESPACE+inputId+'_'+locale;
				
				if( selectedLanguage === locale && $('#'+baseId).val() ){
					obj[locale] = $('#'+baseId).val();
				}
				else{
					let value = $('#'+localizedInputId).val();
					if( value ){
						obj[locale] = value;
					}
					else{
						delete obj[locale];
					}
				}
				
				return obj;
			}, {} );
		}
		
		static setLocalizedInputValue( inputId, valueMap ){
			const selectedLocale = LocalizationUtil.getSelectedLanguage( inputId ).trim();
			
			if( !$.isEmptyObject(valueMap) ){
				$('#'+NAMESPACE+inputId).val( valueMap[selectedLocale]);
				
				AVAILABLE_LANGUAGES.forEach(function(locale, index){
					let $localizedInput = $('#'+NAMESPACE+inputId+'_'+locale);
					if( $localizedInput ){
						$localizedInput.val( valueMap[locale] );
					}
				});
			}
			else{
				LocalizationUtil.clearLocaliedInputValue( inputId );
			}
		}
		
		static clearLocaliedInputValue( inputId ){
			$('#'+NAMESPACE+inputId).val('');
				
			AVAILABLE_LANGUAGES.forEach(function(locale, index){
				let $localizedInput = $('#'+NAMESPACE+inputId+'_'+locale);
				if( $localizedInput ){
					$localizedInput.val( '' );
				}
			});
		}
	}

	
	let FormUIUtil = {
		$getRequiredLabelMark: function( style ){
			let html = 
				'<span class="reference-mark text-warning" style="' + style + '">' +
					'<span style="font-size:0.5rem;">' +
						'<svg class="lexicon-icon lexicon-icon-asterisk" focusable="false" role="presentation" viewBox="0 0 512 512">' +
							'<path class="lexicon-icon-outline" d="M323.6,190l146.7-48.8L512,263.9l-149.2,47.6l93.6,125.2l-104.9,76.3l-96.1-126.4l-93.6,126.4L56.9,435.3l92.3-123.9L0,263.8l40.4-122.6L188.4,190v-159h135.3L323.6,190L323.6,190z"></path>' +
						'</svg>' +
					'</span>' +
					'<span class="hide-accessible">Required</span>' +
				'</span>';

			return $(html);
		},
		$getHelpMessageLabelMark: function( helpMessage, style ){
			let html = 
				'<span class="taglib-icon-help lfr-portal-tooltip" title="' + helpMessage + '" style="' + style + '">' +
					'<span>' +
						'<svg class="lexicon-icon lexicon-icon-question-circle-full" focusable="false" role="presentation" viewBox="0 0 512 512">' +
							'<path class="lexicon-icon-outline" d="M256 0c-141.37 0-256 114.6-256 256 0 141.37 114.629 256 256 256s256-114.63 256-256c0-141.4-114.63-256-256-256zM269.605 360.769c-4.974 4.827-10.913 7.226-17.876 7.226s-12.873-2.428-17.73-7.226c-4.857-4.827-7.285-10.708-7.285-17.613 0-6.933 2.428-12.844 7.285-17.788 4.857-4.915 10.767-7.402 17.73-7.402s12.932 2.457 17.876 7.402c4.945 4.945 7.431 10.854 7.431 17.788 0 6.905-2.457 12.786-7.431 17.613zM321.038 232.506c-5.705 8.923-13.283 16.735-22.791 23.464l-12.99 9.128c-5.5 3.979-9.714 8.455-12.668 13.37-2.955 4.945-4.447 10.649-4.447 17.145v1.901h-34.202c-0.439-2.106-0.731-4.184-0.936-6.291s-0.321-4.301-0.321-6.612c0-8.397 1.901-16.413 5.705-24.079s10.24-14.834 19.309-21.563l15.185-11.322c9.070-6.7 13.605-15.009 13.605-24.869 0-3.57-0.644-7.080-1.901-10.533s-3.219-6.495-5.851-9.128c-2.633-2.633-5.969-4.71-9.977-6.291s-8.66-2.369-13.927-2.369c-5.705 0-10.561 1.054-14.571 3.16s-7.343 4.769-9.977 8.017c-2.633 3.247-4.594 7.022-5.851 11.322s-1.901 8.66-1.901 13.049c0 4.213 0.41 7.548 1.258 10.065l-39.877-1.58c-0.644-2.311-1.054-4.652-1.258-7.080-0.205-2.399-0.321-4.769-0.321-7.080 0-8.397 1.58-16.619 4.74-24.693s7.812-15.214 13.927-21.416c6.114-6.173 13.663-11.176 22.645-14.951s19.368-5.676 31.188-5.676c12.229 0 22.996 1.785 32.3 5.355 9.274 3.57 17.087 8.25 23.435 14.014 6.319 5.764 11.089 12.434 14.248 19.982s4.74 15.331 4.74 23.289c0.058 12.581-2.809 23.347-8.514 32.27z"></path>' +
						'</svg>' +
					'</span>' +
					'<span class="taglib-text hide-accessible">' +
						helpMessage +
					'</span>' +
				'</span>';

			return $(html);
		},
		$getLabelNode: function( label, mandatory, helpMessage ){
			let $label = $( '<div class="control-label" style="font-size:0.875rem;font-weight:600;">' );

			$label.append( $('<span class="sx-label-text">'+label+'</span>') );

			if( mandatory ){
				$label.append( this.$getRequiredLabelMark( 'margin-left:4px; margin-right:2px;' ) );
			}

			if( helpMessage ){
				$label.append( this.$getHelpMessageLabelMark(helpMessage, 'margin-left:2px;') );
			}

			return $label; 
		},
		$getLegendTag: function( label, mandatory, helpMessage){
			if( !label ){
				return;
			}

			let $legend = $( '<legend style="font-size:0.875rem;font-weight:600;">' );

			$legend.append( $('<span>'+label+'</span>') );

			if( mandatory ){
				$legend.append( this.$getRequiredLabelMark( 'margin-left:4px; margin-right:2px;' ) );
			}

			if( helpMessage ){
				$legend.append( this.$getHelpMessageLabelMark(helpMessage, 'margin-left:2px;') );
			}

			return $legend; 
		},
		$getTextInput: function( id, name, type, placeHolder, required, disabled, value, eventFuncs ){
			let $input;
			
			if( type === 'text'){
				$input = $( '<input type="text">' );
			}
			else{
				$input = $( '<textarea style="height:4rem;">' );

				$input.on('keyup', function(event){

				});
			}

			$input.prop({
				class: 'form-control',
				id: id,
				name: name,
				value: value,
				placeholder: placeHolder
			});

			if( disabled ){
				$input.prop( 'disabled', true );
			}

			if( required ){
				$input.prop( 'required', true );
			}

			Object.keys( eventFuncs ).forEach( event => {
				$input.on( event, eventFuncs[event] );
			});

			return $input;
		},
		$getSelectTag: function( controlName, options, value, placeHolder, disabled=false ){
			let $select = $( '<select class="form-control" id="' + controlName + '" name="' + controlName + '">' );

			if( placeHolder ){
				$( '<option value="" hidden>'+placeHolder+'</option>' ).appendTo( $select );
			}

			options.forEach( (option)=>{
				let selected = Util.isNotEmpty(value) ? (option.value === value) : option.selected;
				let $option = option.$render( 
									ListTerm.DISPLAY_STYLE_SELECT, 
									controlName+'_'+option.value, 
									controlName, 
									selected );
				
				$option.text(option.labelMap[CURRENT_LANGUAGE]);
				
				$select.append( $option );

			});

			$select.prop('disabled', disabled );

			$select.on('focus', function(event){
				$(this).data('clickCount', 1);
			});

			$select.on('click', function(event){
				let clickCount = $(this).data('clickCount');
				if( clickCount === 1 ){
					$(this).data('clickCount', 0);
					return;
				}
				
				let prevVal = $(this).data('prevVal');
				let value = $(this).val();
				
				if( prevVal === value ){
					console.log('Same option selected...')
					$(this).val(null);
					$(this).data('prevVal', null);

					$(this).trigger('change');
				}
				else{
					$(this).data('prevVal', value);
				}

				$(this).data('clickCount', 1); 
			});

			return $select;

		},
		$getMultiSelectTag: function( controlId, controlName, options, values, placeHolder, multiple, disabled ){
			let $select;
			if( multiple ){
				let select = '<select id="' + controlId + '" name="' + controlName + '" multiple>';

				options.forEach( option=>{
					select += '<option value="'+ option.value;
					
					if( values && values.includes(option.value) ){
						select += '" selected>';
					}
					else{
						select += '">';
					}
					select += option.labelMap[CURRENT_LANGUAGE];
					select += '</option>'
				});

				select += '</select>';

				$select = $(select);
			}
			else{
				$select = FormUIUtil.$getSelectTag(controlName, options, values, placeHolder, disabled);
			}

			return $select;
		},
		$getRadioButtonTag: function (controlId, controlName, option, selected, disabled ){
			let $radio = option.$render( ListTerm.DISPLAY_STYLE_RADIO, controlId, controlName, selected );
			$radio.find('input[type="radio"]').prop({
				disabled: disabled
			}).css({
				'background-color': 'white'
			});

			return $radio;
		},
		$getCheckboxTag: function( controlId, controlName, label, checked, value, disabled, eventFuncs ){
			let $checkbox = $( '<div class="checkbox" style="display:inline-block;margin-left:10px;margin-right:20px;">' );
			let $label = $( '<label style="font-size:0.8rem;font-weight:400;">' )
							.prop( 'for', controlId ).appendTo( $checkbox );
			
			let $input = $( '<input type="checkbox" style="display:inline-block;margin-right:10px;background-color:white;">').appendTo( $label );
			$input.prop({
				class: "field",
				id: controlId,
				name: controlName,
				value: value,
				checked: checked,
				disabled: disabled
			});

			if( eventFuncs ){
				Object.keys( eventFuncs ).forEach( event => {
					$input.on( event, eventFuncs[event] );
				});
			}
			
			$label.append( label );

			return $checkbox;
		},
		$getFileUploadNode: function( fileTerm, controlName, files ){
			let $node = $('<div class="file-uploader-container">');
			this.$getFileInputTag( controlName, fileTerm.disabled ).appendTo($node);

			let $fileListTable = $('<table id="' + controlName + '_fileList" style="display:none;">').appendTo($node);

			if( files ){
				for( let fileName in files ){
					let file = files[fileName];
					$fileListTable.append( FormUIUtil.$getFileListTableRow( fileTerm, file.parentFolderId, file.fileId, file.name, file.size, file.type, file.downloadURL ) );
				};

				$fileListTable.show();
			}

			return $node;
		},
		$getFileInputTag: function( controlName, disabled=false ){
			let $input = $( '<input type="file" class="field lfr-input-text form-control" aria-required="true" size="80" multiple>' );

			$input.prop({
				id: controlName,
				name: controlName,
				disabled: disabled
			});

			return $input;
		},
		$getFieldsetTag: function( controlName, label, mandatory, helpMessage ){
			let $legend = label ? this.$getLegendTag( label, mandatory, helpMessage ) : undefined;
			let $fieldset = $('<fieldset style="width:fit-content;max-width:100%;border: 1px solid #aaa; box-shadow: 2px 2px #ccc;">').prop({
				'id': controlName,
				'name': controlName
			});

			if( $legend ){
				$fieldset.append( $legend );
			}

			return $fieldset;
		},
		$getActionButton( popupMenu ){
			let $actionBtn = $(
				'<div class="dropdown dropdown-action show" style="width:fit-content;float:right">' +
					'<button aria-expanded="true" aria-haspopup="true" class="dropdown-toggle btn btn-unstyled" data-onclick="toggle" data-onkeydown="null" ref="triggerButton" title="Actions" type="button">' +
						'<svg class="lexicon-icon lexicon-icon-ellipsis-v" focusable="false" role="presentation" viewBox="0 0 512 512">' +
							'<path class="lexicon-icon-outline ellipsis-v-dot-2" d="M319 255.5c0 35.346-28.654 64-64 64s-64-28.654-64-64c0-35.346 28.654-64 64-64s64 28.654 64 64z"></path>' +
							'<path class="lexicon-icon-outline ellipsis-v-dot-3" d="M319 448c0 35.346-28.654 64-64 64s-64-28.654-64-64c0-35.346 28.654-64 64-64s64 28.654 64 64z"></path>' +
							'<path class="lexicon-icon-outline ellipsis-v-dot-1" d="M319 64c0 35.346-28.654 64-64 64s-64-28.654-64-64c0-35.346 28.654-64 64-64s64 28.654 64 64z"></path>' +
						'</svg>' +
					'</button>' + 
				'</div>' );

			$actionBtn.click( function(event){
				popupMenu.x = $(this).offset().left;
				popupMenu.y = $(this).offset().top;

				popmenu( $(this), popupMenu );
			});

			return $actionBtn;
		},
		$getPreviewRemoveButtonNode: function( popupMenu ){
			let $actionBtn = this.$getActionButton( popupMenu );

			$actionBtn.click( function(event){
				popmenu( $(this), popupMenu );
			});

			return $actionBtn;
		},
		$getPreviewRowSection: function( $inputSection, popupMenus ){
			let $inputTd = $('<span style="width:90%;float:left; padding-right:5px;">').append( $inputSection );


			let $buttonTd = $('<span style="float:right; width:10%;text-align:center;">')
								.append( this.$getPreviewRemoveButtonNode( popupMenus ) );

			let $previewRow = $('<div class="sx-form-item-group" style="display:flex; width:100%; padding: 3px; margin:2px; align-items:center; justify-content:center;">')
									.append( $inputTd )
									.append( $buttonTd );

			return $previewRow;
		},
		$getEditorRowSection: function( $inputSection ){
			return $('<div class="sx-form-item-group" style="display:block;width:100%;max-width:100%;padding: 3px; margin:2px;">').append( $inputSection );
		},
		$getSearchRowSection: function( $inputSection ){
			return $('<div class="sx-form-item-group">').css({
				'display':'inline-block',
				'padding':'3px',
				'margin':'2px 5px 8px 5px',
				'width': 'fit-content',
				'min-width':'200px',
				'max-width':'100%',
				'border':'1px solid #fff',
				'box-shadow':'1px 1px 0 1px #898989'
			}).append($inputSection);
		},
		$getAccordionForGroup: function( title, disabled=false, active=true, collapsible=true ){
			let $groupHead = $('<h3>').text(title);
			$groupHead.css({'font-size':'1rem', 'font-weight':'600'});

			let $groupBody = $('<div style="overflow:visible;width:100%; padding:3px;">');
			let $accordion = $('<div style="width:100%;">')
								.append($groupHead)
								.append($groupBody);
			
			$accordion.accordion({
				collapsible: collapsible,
				highStyle: 'content',
				disabled: disabled,
				active: false,
				activate: function(event, ui){
					ui.newPanel.css('height', 'auto');
				}
			});

			return $accordion;
		},
		$getTypeSpecificSection: function( termType ){
			return $('#' + NAMESPACE +  termType.toLowerCase() + 'Attributes');
		},
		replaceVisibleTypeSpecificSection: function( termType ){
			$('#'+NAMESPACE+'typeSpecificSection .type-specific-attrs').hide();

			FormUIUtil.$getTypeSpecificSection( termType ).show();
		},
		getFormRadioValue: function( attrName ){
			return $('input[name="'+NAMESPACE+attrName+'"]:checked').val();
		},
		setFormRadioValue: function( attrName, value ){
			$('input[name="'+NAMESPACE+attrName+'"][value="'+value+'"]' ).prop('checked', true);
		},
		getFormCheckboxValue: function( attrName ){
			let $control = $('#'+NAMESPACE+attrName);
			
			return $control.prop('checked');
		},
		setFormCheckboxValue: function( attrName, value, focus ){
			let $control = $('#'+NAMESPACE+attrName);
			
			if( value ){
				$control.prop( 'checked', value );
			}
			else{
				$control.prop( 'checked', false );
			}
			
			if( focus ){
				$(control).focus();
			}
		},
		getFormCheckedArray: function( attrName ){
			let activeTermNames = $.makeArray( $('input[type="checkbox"][name="'+NAMESPACE+attrName+'"]:checked') )
									.map((checkbox)=>{ return $(checkbox).val();});
			if( !activeTermNames ){
				activeTermNames = new Array();
			}
			
			return activeTermNames;
		},
		setFormCheckedArray: function( attrName, values ){
			$.makeArray( $( 'input[type="checkbox"][name="'+NAMESPACE+attrName+'"]' ) ).forEach((checkbox)=>{
				if( values && values.includes( $(checkbox).val() ) ){
					$(checkbox).prop( 'checked', true );
				}
				else{
					$(checkbox).prop( 'checked', false );
				}
			});
		},
		getFormValue: function( attrName ){
			return $('#'+NAMESPACE+attrName).val();
		},
		setFormValue: function( attrName, value, focus ){
			let $control = $('#'+NAMESPACE+attrName);
			
			if( Util.isNotEmpty(value) ){
				$control.val( value );
			}
			else{
				$control.val( '' );
			}
			
			if( focus ){
				$control.trigger('focus');
			}
		},
		clearFormValue: function( attrName ){
			FormUIUtil.setFormValue( attrName );
		},
		getFormLocalizedValue: function( attrName ){
			let valueMap = LocalizationUtil.getLocalizedInputValue( attrName );

			if( !$.isEmptyObject(valueMap) ){
				return new LocalizedObject( valueMap );
			}
		},
		setFormLocalizedValue: function( attrName, localizedObj, focus=false ){
			let $control = $('#'+NAMESPACE+attrName);

			let localizedMap = localizedObj instanceof LocalizedObject ? localizedObj.localizedMap : undefined;
			
			if( !$.isEmptyObject(localizedMap) ){
				LocalizationUtil.setLocalizedInputValue( attrName, localizedMap );
			}
			else{
				LocalizationUtil.setLocalizedInputValue( attrName );
			}
			
			if( focus ){
				$control.trigger('focus');
			}
		},
		$getControl( controlId ){
			return $('#'+NAMESPACE+controlId);
		},
		$getRenderedFormControl: function( renderUrl, params ){
			return new Promise( function(resolve, reject){
				$.ajax({
					url: renderUrl,
					method: 'post',
					dataType: 'html',
					data: params,
					success: function( response ){
						resolve( $(response) );
					},
					error: function( xhr ){
						reject( xhr);
					}
				});
			});
		},
		disableControls: function(controlIds, disable ){
			controlIds.forEach((controlId)=>{
				$('#'+NAMESPACE+controlId).prop('disabled', disable);
			})
		},
		showError: function( type=Constants.ERROR, title, msg, buttonOptions){
			let options = {
				title: title,
				content: msg,
				type: 'orange',
				typeAnimated: true,
				draggable: true,
				buttons:{
					ok: buttonOptions.ok
				}
			};

			if( type === Constants.CONFIRM ){
				options.buttons.cancel = buttonOptions.cancel;
			}

			$.confirm(options);
		}
	};
	
	const Events = {
		DATATYPE_PREVIEW_DELETE_TERM: 'DATATYPE_PREVIEW_DELETE_TERM',
		DATATYPE_PREVIEW_GROUPUP_TERM: 'DATATYPE_PREVIEW_GROUPUP_TERM',
		DATATYPE_PREVIEW_COPY_TERM: 'DATATYPE_PREVIEW_COPY_TERM',
		DATATYPE_TERM_SELECTED: 'DATATYPE_TERM_SELECTED',
		DATATYPE_FORM_UI_SHOW_TERMS: 'DATATYPE_FORM_UI_SHOW_TERMS',
		DATATYPE_FORM_UI_CHECKBOX_CHANGED: 'DATATYPE_FORM_UI_CHECKBOX_CHANGED',
		LIST_OPTION_PREVIEW_REMOVED: 'LIST_OPTION_PREVIEW_REMOVED',
		LIST_OPTION_PREVIEW_ADDED:'LIST_OPTION_PREVIEW_ADDED',
		LIST_OPTION_PREVIEW_CHANGED:'LIST_OPTION_PREVIEW_CHANGED',
		LIST_DISPLAY_STYLE_CHANGED:'LIST_DISPLAY_STYLE_CHANGED',
		LIST_OPTION_PREVIEW_SELECTED: 'LIST_OPTION_PREVIEW_SELECTED',
		CHOOSE_SLAVE_TERMS: 'CHOOSE_SLAVE_TERMS',
		CHOOSE_GROUP_TERMS: 'CHOOSE_GROUP_TERMS',
		SELECT_GRID_COLUMNS: 'SELECT_GRID_COLUMNS',
		GRID_COLUMN_SELECTED: 'GRID_COLUMN_SELECTED',
		
		SEARCH_FROM_DATE_CHANGED: 'SEARCH_FROM_DATE_CHANGED',
		SEARCH_TO_DATE_CHANGED: 'SEARCH_TO_DATE_CHANGED',
		SEARCH_FROM_NUMERIC_CHANGED: 'SEARCH_FROM_NUMERIC_CHANGED',
		SEARCH_TO_NUMERIC_CHANGED: 'SEARCH_TO_NUMERIC_CHANGED',
		SEARCH_KEYWORD_REMOVE_ALL: 'SEARCH_KEYWORD_REMOVE_ALL',
		SEARCH_KEYWORD_ADDED: 'SEARCH_KEYWORD_ADDED',
		SD_DATE_RANGE_SEARCH_STATE_CHANGED: 'SD_DATE_RANGE_SEARCH_STATE_CHANGED',
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
        SX_CHECK_MANDATORY : 'SX_CHECK_MANDATORY',
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
        TERM_VALUE_CHANGED: 'TERM_VALUE_CHANGED',
        SX_UPLOAD_FILE: 'SX_UPLOAD_FILE',
        SX_UPLOAD_SELECTED: 'SX_UPLOAD_SELECTED',
        SX_RESPONSE_SAVE_SIMULATION_RESULT: 'SX_RESPONSE_SAVE_SIMULATION_RESULT',
        SX_RESPONSE_CREATE_SIMULATION_RESULT: 'SX_RESPONSE_CREATE_SIMULATION_RESULT',
        SX_RESPONSE_DELETE_SIMULATION_RESULT: 'SX_RESPONSE_DELETE_SIMULATION_RESULT',
        SX_RESPONSE_CREATE_SIMULATION_JOB_RESULT: 'SX_RESPONSE_CREATE_SIMULATION_JOB_RESULT',
        SX_RESPONSE_DELETE_SIMULATION_JOB_RESULT: 'SX_RESPONSE_DELETE_SIMULATION_JOB_RESULT',
        SX_RESPONSE_CANCLE_SIMULATION_JOB_RESULT: 'SX_RESPONSE_CANCLE_SIMULATION_JOB_RESULT',
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
		SX_VISUALIZER_READY:'SX_VISUALIZER_READY',
		SX_VISUALIZER_DATA_CHANGED: 'SX_VISUALIZER_DATA_CHANGED',
		SX_VISUALIZER_DATA_LOADED: 'SX_VISUALIZER_DATA_LOADED',
		SX_VISUALIZER_WAITING: 'SX_VISUALIZER_WAITING',

		REMOVE_SLAVE_TERMS: 'REMOVE_SLAVE_TERMS',
		TERM_PROPERTY_CHANGED: 'TERM_PROPERTY_CHANGED',
        
		
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

            Liferay.fire(Event.SX_DATA_CHANGED, eventData);
        },

        reportFileSelected: function(portletId, targetId, data) {
            var eventData = {
                portletId: portletId,
                targetPortlet: targetId,
                data: data
            };

            Liferay.fire(Event.SX_FILE_SELECTED, eventData);
        },

        reportFileDeselected: function(portletId, targetId, data) {
            var eventData = {
                portletId: portletId,
                targetPortlet: targetId,
                data: data
            };

            Liferay.fire(Event.SX_FILE_DESELECTED, eventData);
        },

        responseDataToRequest: function(portletId, data, srcEventData) {
            var eventData = {
                portletId: portletId,
                targetPortlet: srcEventData.portletId,
                sourceEvent: Event.SX_REQUEST_DATA,
                sourceData: srcEventData,
                data: data
            };

            Liferay.fire(Event.SX_RESPONSE_DATA, eventData);
        },
        reportError: function(portletId, targetPortlet, message) {
            var eventData = {
                portletId: portletId,
                targetPortlet: targetPortlet,
                message: message
            };

            Liferay.fire(Event.SX_ERROR, eventData);
        },
        stripNamespace: function(namespace) {
            var id = namespace.slice(namespace.indexOf('_') + 1);
            return id.slice(0, id.lastIndexOf('_'));
        },
        getNamespace: function(instanceId) {
            return '_' + instanceId + '_';
        }	};

	const Constants = {
		//Purposes of rendering
		FOR_NOTHING: 0,
		FOR_PREVIEW: 1,
		FOR_EDITOR: 2,
		FOR_PDF_DATA:3,
		FOR_PDF_FORM:4,
		FOR_SEARCH:5,

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

		Commands:{
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
            VIRTUAL_LAB: 'VIRTUAL_LAB',
        },
        ClusterKey:{
        	CLUSTER:'_cluster',
        	IS_DEFAULT:'_isDefault',
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
			SDEDITOR:'SDEDITOR'
        },
		PathType: {
			FULL_PATH: 'FULL_PATH',
			RELATIVE_PATH: 'RELATIVE_PATH',
			DL_ENTRY: 'DL_ENTRY'
		},
		FileType:{
			DL_ENTRY: 'DL_ENTRY',
			FILE_NAME: 'FILE_NAME',
			CONTENT: 'CONTENT',
			EXTENSION: 'EXTENSION',
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
        WorkflowStatus:{
        	INITIALIZE:{code:"INITIALIZE",value:1702001},
        	CREATED:{code:"CREATED",value:1702002},
        	UPLOAD:{code:"UPLOAD",value:1702003},
        	QUEUED:{code:"QUEUED",value:1702004},
        	RUNNING:{code:"RUNNING",value:1702005},
        	TRANSFER:{code:"TRANSFER",value:1702006},
        	PAUSED:{code:"PAUSED",value:1702009},
        	CANCELED:{code:"CANCELED",value:1702010},
        	SUCCESS:{code:"SUCCESS",value:1702011},
        	FAILED:{code:"FAILED",value:1702012}
        }
	};
	
	class LocalizedObject {
		#localizedMap;

		get localizedMap(){ return this.#localizedMap; }
		set localizedMap(val){ this.#localizedMap = val; }

		constructor( localizedMap  ){
			if( $.isEmptyObject(localizedMap) ){
				this.localizedMap = new Object();
			}
			else{
				this.localizedMap = localizedMap;
			}
		}
		
		isEmpty(){
			return $.isEmptyObject(this.localizedMap);
		}

		isNotEmpty(){
			return !this.isEmpty();
		}
		
		getText( locale ){
			return this.localizedMap[locale] ? this.localizedMap[locale] : this.localizedMap[DEFAULT_LANGUAGE];
		}
		
		addText( locale, text, force ){
			this.localizedMap[locale] = text;
		}
		
		updateText( locale, text ){
			this.localizedMap[locale] = text;
		}
		
		removeText( locale ){
			delete this.localizedMap[locale];
		}
		
		
		
		toXML(){
			
		}
		
		toJSON(){
			return this.localizedMap;
		}
		
		parseXML( xml ){
			
		}
		
		parse( jsonContent ){
			let content = jsonContent;
			if( typeof jsonContent === 'string' ){
				content = JSON.parse( jsonContent );
			}
			
			for( key in content ){
				this.localizedMap[key] = content[key];
			}
		}
	}

	class ListOption{
		#label;
		#value;
		#$rendered;
		#$defined;
		#slaveTerms;
		#disabled;
		#selected;

		get label(){ return this.#label; }
		set label(val){
			this.#label = Util.toSafeLocalizedObject(val);
		}
		get value(){ return this.#value; }
		set value(val){ this.#value = val; }
		get $rendered(){ return this.#$rendered; }
		set $rendered(val){ this.#$rendered = val; }
		get $defined(){ return this.#$defined; }
		set $defined(val){ this.#$defined = val; }
		get slaveTerms(){ return this.#slaveTerms; }
		set slaveTerms(val){ this.#slaveTerms = val; }
		get disabled(){ return this.#disabled; }
		set disabled(val){ this.#disabled = val; }
		get selected(){ return this.#selected; }
		set selected(val){ this.#selected = val; }

		get labelMap(){ return this.label.localizedMap; }

		constructor( optionLabel, optionValue, selected, slaveTerms, disabled ){
			this.value = optionValue;
			this.label = optionLabel;
			if( Util.isNotEmpty(slaveTerms) ){
				this.slaveTerms = slaveTerms;
			}

			this.selected = selected;
			this.disabled = disabled;
		}

		getLocalizedLabel( languageId ){
			return this.label.localizedMap[languageId];
		}

		addSlaveTerm( term ){
			this.slaveTerms.push( term );
		}

		removeSlaveTerm( termName ){
			this.slaveTerms = this.slaveTerms.filter(( slaveTerm ) => slaveTerm !== termName );
		}

		hasSlaves(){
			return (this.#slaveTerms instanceof Array) && this.#slaveTerms.length > 0;
		}

		$render( renderStyle, optionId, optionName, selected ){
			if( renderStyle === ListTerm.DISPLAY_STYLE_SELECT ){
				let $option = $( '<option>' );
				
				$option.prop('value', this.value);
				if( selected === true ){
					$option.prop( 'selected', true );
				};

				$option.text(this.label.getText(CURRENT_LANGUAGE));

				return $option;
			}
			else if( renderStyle === ListTerm.DISPLAY_STYLE_RADIO ){
				let $label = $( '<label style="font-weight:400;">' );
				let $input = $( '<input type="radio">')
										.prop({
											class: "field",
											id: optionId,
											name: optionName,
											value: this.value,
											checked: selected,
											disabled: this.disabled
										});

				$label.prop('for', optionId )
						.append($input)
						.append( '<span>'+this.label.getText(CURRENT_LANGUAGE)+'</span>' );

				let $radio = $( '<div class="radio" style="display:inline-block; margin-left:10px; margin-right:10px;">' )
								.append( $label );
				$input.click(function(event){
					event.stopPropagation();

					let wasChecked =  $radio.data('checked');
					
					$(this).prop('checked', !wasChecked);
					$radio.data('checked', !wasChecked);
					
					$radio.siblings().data('checked', false);

					$radio.trigger('click');

					if( wasChecked )
						$radio.trigger('change');
				});
				

				$label.click(function(event){
					event.stopPropagation();
				});


				return $radio;
			}
			else{ // renderStyle === ListTerm.DISPLAY_STYLE_CHECK
				let $label = $( '<label>' )
							.prop( 'for', optionId );
			
				let $input = $( '<input type="checkbox" class="field" style="margin-right:10px;">');
				$input.prop({
					id: optionId,
					name: optionName,
					value: this.value,
					checked: selected,
					disabled: this.disabled
				});
				
				$label.append( $input )
					  .append( this.label.getText(CURRENT_LANGUAGE) );

				let $checkbox = $( '<div class="checkbox" style="display:inline-block;margin-left:10px;margin-right:20px;">' )
									.append( $label );
				
				return $checkbox;
			}
		}

		removePreview(){
			if( Util.isNotEmpty(this.$rendered) )
				this.$rendered.remove();
		}

		toJSON(){
			let json = new Object();

			json.value = this.value;
			json.label = this.label.toJSON();
			if( this.selected ){
				json.selected = true;
			}
			if( Util.isNonEmptyArray(this.slaveTerms) ){
				json.slaveTerms = this.slaveTerms;
			}

			return json;
		}
	}

	class Term {
		static DEFAULT_TERM_ID = 0;
		static DEFAULT_TERM_VERSION = '1.0.0';
		static DEFAULT_MANDATORY = false;
		static DEFAULT_ABSTRACT_KEY = false;
		static DEFAULT_SEARCHABLE = true;
		static DEFAULT_DOWNLOADABLE = true;
		static DEFAULT_MIN_LENGTH = 1;
		static DEFAULT_VALUE_MODE = Constants.SINGLE;

		static VALID_NAME_PATTERN=/^[_a-zA-Z]([_a-zA-Z0-9])*$/;

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

		static GROUP_ACTIVE_COLOR = '#efefef';
		static GROUP_ACTIVE_FULL_COLOR = '#ec8ff0';
		static GROUP_INACTIVE_COLOR = '#454545';
		static GROUP_INACTIVE_FULL_COLOR = '#ec8ff0';

		static TERM_LABEL_COLOR = '#272833';
		static TERM_LABEL_FULL_COLOR = '#bc0505';
		
		static KEYWORD_REG_EXPR = /[\s]*[,\s]+[\s]*/;

		static DEFAULT_SEARCH_OPERATOR = 'and';

		static WIDTH_UNIT = 'rem';

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

		get id(){return this.#id;}
		set id(val){this.#id = Util.toSafeNumber(val);}
		get termType(){return this.#termType;}
		set termType(val){this.#termType=val;}
		get termName(){return this.#termName;}
		set termName(val){this.#termName=val;}
		get termVersion(){return this.#termVersion;}
		set termVersion(val){this.#termVersion=val;}
		get synonyms(){return this.#synonyms;}
		set synonyms(val){this.#synonyms=val;}
		get displayName(){return this.#displayName;}
		set displayName(val){this.#displayName=Util.toSafeLocalizedObject(val);}
		get definition(){return this.#definition;}
		set definition(val){this.#definition=Util.toSafeLocalizedObject(val);}
		get tooltip(){return this.#tooltip;}
		set tooltip(val){this.#tooltip=Util.toSafeLocalizedObject(val);}
		get mandatory(){return this.#mandatory;}
		set mandatory(val){this.#mandatory=Util.toSafeBoolean(val, false);}
		get disabled(){return this.#disabled;}
		set disabled(val){
			this.#disabled=Util.toSafeBoolean(val, false);

			if( !this.isRendered() ) return;

			switch( this.termType ){
				case TermTypes.STRING:
				{
					console.log('disable string');
					let tag = this.multipleLine ? 'textarea' : 'input';
					this.$rendered.find(tag).first().prop('disabled', this.#disabled );
					break;
				}	
				case TermTypes.NUMERIC:
				case TermTypes.MATRIX:
				case TermTypes.EMAIL:
				case TermTypes.PHONE:
				case TermTypes.FILE:
				case TermTypes.DATE:
				{
					console.log('disable numeric');
					this.$rendered.find('input').prop('disabled', this.#disabled );
					break;
				}
				case TermTypes.ADDRESS:
				{
					this.$rendered.find('input').last().prop('disabled', this.#disabled );
					break;
				}
				case TermTypes.LIST:
				case TermTypes.BOOLEAN:
				{
					let tag = (this.displayStyle === 'select') ? 'select' : 'input';
					this.$rendered.find(tag).prop('disabled', this.#disabled );
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
		get abstractKey(){return this.#abstractKey;}
		set abstractKey(val){this.#abstractKey=Util.toSafeBoolean(val, false);}
		get downloadable(){return this.#downloadable;}
		set downloadable(val){this.#downloadable=Util.toSafeBoolean(val, true);}
		get searchable(){return this.#searchable;}
		set searchable(val){this.#searchable=Util.toSafeBoolean(val, false);}
		get standard(){return this.#standard;}
		set standard(val){this.#standard=Util.toSafeBoolean(val, false);}
		get masterTerm(){return this.#masterTerm;}
		set masterTerm(val){this.#masterTerm=val;}
		get cssWidth(){return this.#cssWidth;}
		set cssWidth(val){
			this.#cssWidth = val ? val : '100%';
		}
		get cssCustom(){return this.#cssCustom;}
		set cssCustom(val){this.#cssCustom=val;}
		get gridTerm(){return this.#gridTerm;}
		set gridTerm(val){this.#gridTerm=val;}

		get $rendered(){return this.#$rendered;}
		set $rendered(val){this.#$rendered=val;}
		get $pdf(){return this.#$pdf;}
		set $pdf(val){this.#$pdf=val;}
		get $label(){ return this.#$rendered.find('.sx-label-text').first(); }
		
		get dirty(){return this.#dirty;}
		set dirty(val){this.#dirty=val;}
		get state(){return this.#state;}
		set state(val){this.#state=val;}
		get status(){return this.#status;}
		set status(val){this.#status=val;}
		get order(){return this.#order;}
		set order(val){this.#order= Util.toSafeNumber(val);}
		get groupTermId(){
			if( !this.#groupTermId ){
				this.#groupTermId = new TermId();
			}
			return  this.#groupTermId;
		}
		set groupTermId(val){this.#groupTermId=Util.toSafeTermId(val);}
		
		get groupId(){return this.groupTermId;}
		get termId(){ return new TermId(this.termName, this.termVersion); }
		
		constructor( termType ){
			
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

		static validateTermVersion( updated, previous ){
			let updatedParts = updated.split('.');
			
			let validationPassed = true;
			
			// Check valid format
			if( updatedParts.length !== 3 )		return false;
			
			updatedParts.every((part)=>{
				
				let int = Number(part); 
				
				if( Number.isInteger(int) ){
					return Constants.CONTINUE_EVERY;
				}
				else{
					validationPassed = Constants.FAIL;
					return Constants.STOP_EVERY;
				}
			});
			
			if( !validationPassed )		return false;
			
			// updated version should be bigger than previous versison
			if( previous ){
				
				let previousParts = previous.split('.');
				
				if( Number(updatedParts[0]) < Number(previousParts[0]) ){
					validationPassed = false;
				}
				else if( Number(updatedParts[1]) < Number(previousParts[1]) ){
					validationPassed = false;
				}
				else if( Number(updatedParts[2]) <= Number(previousParts[2]) ){
					validationPassed = false;
				}
			}
			
			return validationPassed;
		}

		static validateTermName( termName ){
			return /^[_|a-z|A-Z][_|a-z|A-Z|0-9]*/.test( termName );
		}

		activate( active=Term.STATE_ACTIVE ){
			this.state = active;

			if( !this.isRendered() )	return;

			if( active === Term.STATE_ACTIVE ){
				this.$rendered.show();
			}
			else{
				this.$rendered.hide();
			}
		}

		getPreviewPopupAction(){
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

			if( this.isMemberOfGroup() ){
				items.groupUp = {
					name: '<span style="font-size:0.8rem;font-weight:400;">Group Up</span>',
					icon: '<span class="ui-icon ui-icon-arrowreturnthick-1-n"></span>'
				};
			}

			if( this. isGroupTerm() ){
				items.deleteAll = {
					name: '<span style="font-size:0.8rem;font-weight:400;">Delete All</span>',
					icon: '<span class="ui-icon ui-icon-closethick"></span>'
				};
			}

			return {
				items: items,
				callback: function( item ){
					let dataPacket = Util.createEventDataPacket( NAMESPACE, NAMESPACE );
					dataPacket.source = 'getPreviewPopupAction()';
					dataPacket.term = self;
	
					let message;

					switch( $(item).prop('id') ){
						case 'copy':
						{
							message = Events.DATATYPE_PREVIEW_COPY_TERM;
							break;
						}
						case 'delete':
						{
							message = Events.DATATYPE_PREVIEW_DELETE_TERM;
							dataPacket.children = false;
							break;
						}
						case 'groupUp':
						{
							message = Events.DATATYPE_PREVIEW_GROUPUP_TERM;
							break;
						}
						case 'deleteAll':
						{
							message = Events.DATATYPE_PREVIEW_DELETE_TERM;
							dataPacket.children = true;
							break;
						}
					}

					Util.fire( message, dataPacket );
				},
				position: 'left'
			};
		}

		isTopLevel(){
			return this.groupId.isEmpty();
		}

		isRendered(){
			return !!this.$rendered;
		}

		displayInputStatus( status ){
			if( !this.isRendered() )	return;

			if( !status ){
				return 0;
			} 

			if( this.hasValue() ){
				return 1;
			}
			else{
				return 0;
			}
		}

		isOrdered(){
			return (this.order && this.order > 0) ? true : false;
		}

		isHighlighted(){
			if( !this.$rendered )	return false;
			return this.$rendered.hasClass('highlight-border');
		}

		isMemberOfGroup(){
			return this.groupTermId && this.groupTermId.isNotEmpty();
		}

		isGroupTerm(){
			return this.termType === TermTypes.GROUP;
		}

		isColumn(){
			return !!this.#gridTerm;
		}

		isVisible(){
			return this.#$rendered ? this.#$rendered.is(':visible') : false;
		}

		isActive(){
			return this.#state === Term.STATE_ACTIVE;
		}

		isSlave(){
			return !Util.isEmpty(this.masterTerm);
		}

		emptyRender(){
			if( this.$rendered ){
				this.$rendered.remove();
				this.$rendered = undefined;
			}
		}

		equal( term ){
			if( this === term ){
				return true;
			}

			if( this.termName === term.termName && this.termVersion === this.termVersion ){
				return true;
			}

			return false;
		}

		getLocalizedDisplayName(){
			if( !this.displayName || this.displayName.isEmpty() ){
				return '';
			}
			else{
				return this.displayName.getText(CURRENT_LANGUAGE);
			}
		}

		getLocalizedDefinition(){
			if( !this.definition || this.definition.isEmpty() ){
				return '';
			}
			else{
				return this.definition.getText(CURRENT_LANGUAGE);
			}
		}

		getLocalizedTooltip(){
			if( !this.tooltip || this.tooltip.isEmpty() ){
				return '';
			}
			else{
				const tooltip = this.tooltip.getText(CURRENT_LANGUAGE);
				return tooltip ? tooltip : this.tooltip.getText(DEFAULT_LANGUAGE);
			}
		}

		multiSelectize(){}

		/**
		 *  Validate the term name matches naming pattern.
		 *  If it is needed to change naming pattern, 
		 *  change VALID_NAME_PATTERN static value.
		 *  
		 *   @return
		 *   		true,		if matched
		 *   		false,		when not matched
		 */
		validateNameExpression( name ){
			if( name ){
				return Term.VALID_NAME_PATTERN.test( name );
			}
			else{
				return Term.VALID_NAME_PATTERN.test(this.termName);
			}
		}
		
		validateMandatoryFields(){
			if( !this.termName )	return 'termName';
			if( !this.termVersion ){
				this.getTermVersionFormValue();
				if( !this.termVersion )	return 'termVersion';
			}	
			if( !this.displayName || this.displayName.isEmpty() )	return 'displayName';
			
			return true;
		}
		
		validate(){
			let result = this.validateMandatoryFields();
			if( result !== true ){
				console.log( 'Non-proper term: ', this );
				$.alert( result + ' should be not empty.' );
				$('#'+NAMESPACE+result).focus();
				
				return false;
			}
			
			if( this.validateNameExpression() === false ){
				$.alert( 'Invalid term name. Please try another one.' );
				$('#'+NAMESPACE+result).focus();
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
		$render( forWhat, prefix ){
			console.log('Interface called: implement this interface!!!!')
			return;
		}

		$getLabelNode( forWhat, prefix ){
			let displayName = !!prefix ? prefix + this.getLocalizedDisplayName() : this.getLocalizedDisplayName();

			if( forWhat === Constants.FOR_PREVIEW || 
				forWhat === Constants.FOR_EDITOR ){
				return FormUIUtil.$getLabelNode( 
					displayName, 
					this.mandatory, 
					this.getLocalizedTooltip() );
				}
			else if( forWhat === Constants.FOR_SEARCH ){
				return FormUIUtil.$getLabelNode( 
					displayName, 
					false, 
					this.getLocalizedTooltip() );
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				let itemNo = '';

				return FormUIUtil.$getLabelNode( 
					displayName, 
					this.mandatory );
			}
		}

		$renderSearchItem(){
			let $item = $('<span style="font-size:0.8rem;font-weight:600;display:inline-block;width:100%;padding:5px;">');
			$item.text(this.getLocalizedDisplayName());

			let self = this;
			$item.on('click', function(event){
				//let expanded = $item.data('expanded');
				//if( expanded )	return;
				if($item.next()) $item.next().remove();

				$item.after( self.$getControlNode(Constants.FOR_SEARCH) );
				//$item.data('expanded', true);
			});

			this.$rendered = FormUIUtil.$getSearchRowSection( $item );

			return this.$rendered;
		}

		toJSON(){
			let json = new Object();
			
			/* required properties */
			json.termType = this.termType;
			json.termName = this.termName;	
			json.termVersion = this.termVersion;
			json.displayName = this.displayName.toJSON();
			json.cssWidth = this.cssWidth;

			/* Never saved if undefined */
			if( this.abstractKey )	json.abstractKey = true;
			if( !this.searchable )	json.searchable = false;
			if( !this.downloadable )	json.downloadable = false;
			if( Util.isNotEmptyString(this.synonyms) ) 		json.synonyms = this.synonyms;
			if( this.mandatory )		json.mandatory = true;
			if( this.disabled )		json.disabled = true;
			if( Util.isSafeLocalizedObject(this.definition) ) 	json.definition = this.definition.toJSON();
			if( Util.isSafeLocalizedObject(this.tooltip) ) json.tooltip = this.tooltip.toJSON();
			if( Util.isSafeNumber(this.order) )			json.order = this.order;
			if( this.dirty )			json.dirty = this.dirty;
			if( Util.isNotEmptyString(this.masterTerm) )		json.masterTerm = this.masterTerm;
			if( this.isMemberOfGroup() )			json.groupTermId = this.groupTermId.toJSON();
			if( this.id )	json.id = this.id;
			if( this.cssCustom )	json.cssCustom = this.cssCustom;
			
			/* Keep this properties in lifetime */
			json.state = this.state;
			json.status = this.status;
			json.standard = this.standard;
			
			return json;
		}
		
		parse( json ){
			let unparsed = new Object();
			
			let self = this;
			Object.keys( json ).forEach(function(key, index){
				switch( key ){
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
	} // End of Term
	
	/* 1. String */
	class StringTerm extends Term {
		static DEFAULT_MIN_LENGTH = 1;
		static DEFAULT_MAX_LENGTH = 72;
		static DEFAULT_MULTIPLE_LINE = false;
		static DEFAULT_VALIDATION_RULE = '^[\w\s!@#\$%\^\&*\)\(+=._-]*$';

		#minLength;
		#maxLength;
		#multipleLine;
		#placeHolder;
		#value;
		#validationRule;

		/**************************************************
		 * getters and setters
		 **************************************************/
		get minLength(){return this.#minLength;}
		set minLength(minLength){
			if( minLength === undefined ){
				this.#minLength = undefined;
			}
			else{
				let safeVal = Util.toSafeNumber(minLength, this.minLength);
				if( !isNaN(safeVal) ){
					if( !Util.isSafeNumber(this.maxLength) ){
						this.#minLength = safeVal;
					} 
					else if( this.maxLength >= safeVal){
						this.#minLength = safeVal;
					}
					else{
						$.alert('Non-proper minimum length:' + safeVal);
					}
				}
				else{
					this.#minLength = undefined;
				}
			}
		}
		get maxLength(){return this.#maxLength;}
		set maxLength(maxLength){
			if( maxLength === undefined ){
				this.#maxLength = undefined;
			}
			else{
				let safeVal = Util.toSafeNumber(maxLength, this.maxLength);
				if( !isNaN(safeVal) ){
					if( !Util.isSafeNumber(this.minLength) ){
						this.#maxLength = safeVal;
					}
					else if( this.minLength <= safeVal){
						this.#maxLength = safeVal;
					}
					else{
						$.alert('Non-proper maximum length:' + safeVal);
					}
				}
				else{
					this.#maxLength = undefined;
				}
			}
		}
		get multipleLine(){return this.#multipleLine ? this.#multipleLine : false;}
		set multipleLine(multipleLine){this.#multipleLine = Util.toSafeBoolean(multipleLine);}
		get placeHolder(){ return this.#placeHolder; }
		set placeHolder(val){ this.#placeHolder = Util.toSafeLocalizedObject(val, this.placeHolder); }
		get value(){ return this.#value; }
		set value(val){ this.#value = val; }
		get validationRule(){ return this.#validationRule; }
		set validationRule(val){ this.#validationRule = val; }

		constructor( jsonObj ){
			super( 'String' );

			this.minLength = StringTerm.DEFAULT_MIN_LENGTH;
			this.maxLength = StringTerm.DEFAULT_MAX_LENGTH;
			this.multipleLine = StringTerm.DEFAULT_MULTIPLE_LINE;
			this.validationRule = StringTerm.DEFAULT_VALIDATION_RULE;

			if( jsonObj ) this.parse( jsonObj );

		}

		validate( val ){
			if( !this.validationRule )	return true;

			let regExp = new RegExp( this.validationRule, 'g' );
			
			//return regExp.test(val);
			return true;
		}

		hasValue(){
			return !!this.value;
		}

		clone(){
			return new StringTerm( this.toJSON() );
		}
		
		toJSON(){
			let json = super.toJSON();
			
			if( Util.isSafeLocalizedObject(this.placeHolder) )
				json.placeHolder = this.placeHolder.localizedMap;
			if( Util.isSafeNumber(this.minLength) )		
				json.minLength = this.minLength;
			if( Util.isSafeNumber(this.maxLength) )		
				json.maxLength = this.maxLength;
			if( this.multipleLine !== StringTerm.DEFAULT_MULTIPLE_LINE)	
				json.multipleLine = this.multipleLine;
			if( this.validationRule !== StringTerm.DEFAULT_VALIDATION_RULE )
				json.validationRule = this.validationRule;
			if( this.inputSize ) json.inputSize = this.inputSize;
			json.lineBreak = this.lineBreak;
			if( this.hasValue() ) json.value = this.value;
			
			return json;
		}
		
		parse( json ){
			let unparsed = super.parse( json );
			let unvalid = new Object();
			
			Object.keys( unparsed ).forEach( (key, index) => {
				switch( key ){
					case 'placeHolder':
					case 'minLength':
					case 'maxLength':
					case 'multipleLine':
					case 'validationRule':
					case 'value':
					case 'inputSize':
					case 'lineBreak':
						this[key] = json[key];
						break;
					case 'dirty':
						break;
					default:
						console.log('Un-identified Attribute: '+key);
						unvalid[key] = json[key];
				}
			});

			return unvalid;
		}

		$getControlNode( forWhat ){
			let id = NAMESPACE + this.termName;
			let name = NAMESPACE + this.termName;
			let type, value, required, disabled, placeHolder;
			let width = this.cssWidth ? this.cssWidth : '100%';

			let self = this;
			let eventFuncs = {};
			if( forWhat === Constants.FOR_EDITOR || forWhat === Constants.FOR_PREVIEW ){
				type = this.multipleLine ? 'textarea' : 'text';
				placeHolder = this.getLocalizedTooltip();
				required = this.mandatory;
				disabled = this.disabled;
				value = this.value;

				eventFuncs.change = function( event ){
					event.stopPropagation();

					let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
					dataPacket.term = self;
					dataPacket.attribute = TermAttributes.VALUE;
					dataPacket.value = $(this).val();
					
					Util.fire( Events.TERM_VALUE_CHANGED, dataPacket );					
				};
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				type = 'text';
				placeHolder = Liferay.Language.get( 'search-keywords' );
				required = false;
				disabled = false;
				value = '';
				width = '100%';

				eventFuncs.change = function( event ){
					event.stopPropagation();

					let keywords = $(this).val();
					keywords = Util.isEmpty(keywords) ? null : keywords.split( Term.KEYWORD_REG_EXPR );

					let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
					dataPacket.term = self;
					dataPacket.keywords = keywords

					Util.fire(Events.SEARCH_KEYWORD_CHANGED, dataPacket );
				};
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				type = 'text';
				id += '_pdf';
				name = id;
				disabled = false;
				value = '';
				eventFuncs = {};
			}

			return FormUIUtil.$getTextInput( 
				id, name, type, placeHolder, required, disabled, value, eventFuncs ).css({
					'width': width,
					'max-width': '100%',
					'border': '1px solid #dddddd',
					'margin-left': '15px'
				});
		}

		/**
		 * Render term UI for preview
		 */
		$render( forWhat, prefix ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			let $section = $('<div style="padding-right:15px;">');

			$section.append( this.$getLabelNode( forWhat, prefix ) );

			$section.append( this.$getControlNode( forWhat ) );

			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection( 
										$section, 
										this.getPreviewPopupAction() );
			}
			else if(forWhat === Constants.FOR_EDITOR ){
				this.$rendered = FormUIUtil.$getEditorRowSection( $section );
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				this.$rendered = FormUIUtil.$getSearchRowSection( $section );
			}

			return this.$rendered;
		}

		getLocalizedPlaceHolder( locale=CURRENT_LANGUAGE){
			if( !this.placeHolder || this.placeHolder.isEmpty() ){
				return '';
			}
			else{
				return this.placeHolder.getText(locale);
			}
		}
	}
	
	/* 2. NumericTerm */
	class NumericTerm extends Term{
		#value;
		#uncertainty;
		#uncertaintyValue;
		#minValue;
		#minBoundary;
		#maxValue;
		#maxBoundary;
		#unit;
		#sweepable;
		#placeHolder;

		constructor( jsonObj ){
			super('Numeric');

			this.uncertainty = false;
			this.sweepable = false;

			if( jsonObj )	this.parse( jsonObj );
		}

		/**************************************************
		 * getters and setters
		 **************************************************/
		get value(){
			if( this.#uncertainty && this.#uncertaintyValue ){
				return {
					value: this.#value,
					uncertainty: this.#uncertaintyValue
				}
			}
			else{
				return this.#value;
			}
		}
		set value(val){
			if( Util.isEmpty(val) ){
				this.#value = undefined;
			}
			else{
				if( typeof val === 'object' ){
					this.#value = val.value;
					this.#uncertaintyValue = val.uncertainty;
				}
				else{
					let safeVal = Util.toSafeNumber(val, this.value);
					
					if( safeVal !== undefined ){
						if( this.minmaxValidation(safeVal) ){
							this.#value = safeVal;
						}
						else{
							$.alert('Not proper number for [ ' + this.getLocalizedDisplayName() + ' ]: ' + safeVal);
						}
					}
				}	
			}
		}
		get uncertaintyValue(){ return this.#uncertaintyValue; }
		set uncertaintyValue(val){ 
			if( val === undefined ){
				this.#uncertaintyValue = undefined;
			}
			else{
				this.#uncertaintyValue = Util.toSafeNumber(val, this.uncertaintyValue);
				if( isNaN(this.#uncertaintyValue) ){
					$.alert(Liferay.Language.get('only-numbers-allowed-for-uncertainty-value'));
					this.#uncertaintyValue = undefined;
				}
			}
		}
		get minValue(){ return this.#minValue; }
		set minValue(val){ 
			if( val === undefined ){
				this.#minValue = undefined;
			}
			else{
				let safeVal = Util.toSafeNumber(val, this.minValue);
				if( Util.isSafeNumber(safeVal) ){
					if( this.maxValidation(safeVal) ){
						this.#minValue = safeVal;
					}
					else{
						$.alert('Not proper minimum number for [ ' + this.termName + ' ]: ' + safeVal);
					}
				}
				else{
					$.alert(Liferay.Language.get('only-numbers-allowed-for-min-value'));
					this.#minValue = undefined;
				}
			}
		}
		get maxValue(){ return this.#maxValue; }
		set maxValue(val){ 
			if( val === undefined ){
				this.#maxValue = undefined;
			}
			else{
				let safeVal = Util.toSafeNumber(val, this.maxValue);
				if( Util.isSafeNumber(safeVal) ){
					if( this.minValidation(safeVal) ){
						this.#maxValue = safeVal;
					}
					else{
						$.alert('Not proper number: ' + safeVal);
					}
				}
				else{
					$.alert(Liferay.Language.get('only-numbers-allowed-for-max-value'));
					this.#maxValue = undefined;
				}
			}
		}
		get uncertainty(){ return this.#uncertainty; }
		set uncertainty(val){this.#uncertainty = Util.toSafeBoolean(val);}
		get minBoundary(){ return this.#minBoundary; }
		set minBoundary(val){this.#minBoundary = Util.toSafeBoolean(val);}
		get maxBoundary(){ return this.#maxBoundary; }
		set maxBoundary(val){this.#maxBoundary = Util.toSafeBoolean(val);}
		get unit(){ return this.#unit; }
		set unit(val){this.#unit = val;}
		get sweepable(){ return this.#sweepable; }
		set sweepable(val){this.#sweepable = Util.toSafeBoolean(val);}
		get placeHolder(){ return this.#placeHolder; }
		set placeHolder(val){this.#placeHolder = val;}

		
		$getControlNode( forWhat ){
			if( forWhat === Constants.FOR_EDITOR || forWhat === Constants.FOR_PREVIEW ){
				return this.$getEditorNumericNode();
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				return this.$getSearchNumericNode();
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				return this.$getPDFNumericNode();
			}

			return;
		}

		$getPDFNumericNode(){
			let term = this;

			let valueName = NAMESPACE + term.termName + '_pdf';
			let uncertaintyId = NAMESPACE + term.termName + '_uncertainty_pdf';

			let $node = 
					$('<div style="font-size:0.8rem; font-weight:400;width:100%;max-width:100%;margin-left:10px;">');

			if( Util.isNotEmpty( this.minValue) ){
				$('<span style="display:inline-block;max-width:fit-content;text-align:center;width:fit-content;"><strong>' +
					this.minValue + '</strong></span>').appendTo( $node );
				
				let minBoundaryText = '&lt;';
				if( this.minBoundary ){
					minBoundaryText = '&le;';
				}

				$('<span style="display:inline-block;max-width:fit-content;width:fit-content;text-align:center;margin:3px 3px;"><strong>' +
						minBoundaryText + '</strong></span>').appendTo( $node );

			}
			
			//let $inputCol = $('<span style="display:inline-block; min-width:30%;width:-webkit-fill-available;">').appendTo($node);

			FormUIUtil.$getTextInput( 
					valueName, 
					valueName, 
					'text',  
					'', 
					this.mandatory, 
					false, 
					'', 
					{} ).removeClass('form-control')
					.css({
						'border': '1px solid #dddddd'
					}).appendTo($node);

			if( this.uncertainty ){
				$('<div style="display:inline-block;max-width:fit-content;width:fit-content;text-align:center;margin:0 5px 0 5px;"><strong>&#xB1;</strong></div>')
					.appendTo( $node );

				FormUIUtil.$getTextInput( 
					uncertaintyId, 
					valueName, 
					'text', 
					'', 
					false, 
					false, 
					'', 
					{} ).removeClass('form-control')
					.css({
						'border': '1px solid #dddddd'
					}).appendTo($node);
			}

			if( !!this.unit ){
				$('<div style="display:inline-block;min-width:fit-content;max-width:fit-content;width:fit-content;text-align:center;margin:1rem 10px 0 10px;">' +
						this.unit + '</div>').appendTo( $node );
			}

			if( Util.isNotEmpty(this.maxValue) ){
				let maxBoundaryText = this.maxBoundary ? '&le;' : '&lt;';
				
				$('<div style="display:inline-block;min-width:fit-content;max-width:fit-content;width:fit-content;text-align:center;margin:0 3px 0 3px;"><strong>' +
					maxBoundaryText + '</strong></div>').appendTo( $node );

				$('<div style="display:inline-block;min-width:fit-content;max-width:fit-content;width:fit-content;text-align:center;"><strong>' +
					this.maxValue + '</strong></div>').appendTo( $node );
			}
			
			return $node;
		}

		$getSearchNumericNode(){
			let term = this;
			let controlName = NAMESPACE + this.termName;

			let $node = $('<div>');

			if( Util.isNotEmpty(this.minValue) ){
				$node.append($('<span>'+this.minValue+'</span>'));

				if( !!this.minBoundary ){
					$node.append($('<span style="margin-left:5px; margin-right:5px;">&le;</span>'));
				}
				else{
					$node.append($('<span style="margin-left:5px; margin-right:5px;">&lt;</span>'));
				}
			}

			let $fromInputTag = FormUIUtil.$getTextInput(
				controlName+'_from',
				controlName,
				'text',
				Liferay.Language.get('search-keyword'),
				false,
				false,
				'',
				{}
			).css({
				'width':'35%',
				'display': 'inline-block'
			}).addClass('sx-search-form-control').appendTo( $node );

			
			let $curlingSpan = $('<span style="margin: 0px 5px;max-width:4%;">~</span>')
									.hide().appendTo($node);

			let $toInputTag = FormUIUtil.$getTextInput(
				controlName+'_to',
				controlName,
				'text',
				Liferay.Language.get('search-keyword'),
				false,
				false,
				'',
				{}
			).css({
				'width': '35%',
				'display': 'inline-block'
			}).addClass('sx-search-form-control').hide().appendTo( $node );
						
			if( Util.isNotEmpty(this.maxValue) ){
				if( !!this.maxBoundary ){
					$node.append($('<span style="margin-left:5px; margin-right:5px;">&le;</span>'));
				}
				else{
					$node.append($('<span style="margin-left:5px; margin-right:5px;">&lt;</span>'));
				}
				
				$node.append($('<span>'+this.maxValue+'</span>'));
				
			}
			
			if( !!this.unit ){
				$node.append($('<span style="margin-left:5px; margin-right:5px;">'+this.unit+'</span>'));
			}

			let $rangeSearch = FormUIUtil.$getCheckboxTag( 
				controlName+'_rangeSearch',
				controlName+'_rangeSearch',
				Liferay.Language.get( 'range' ),
				false,
				'rangeSearch',
				false,
				{}
			).css({'float':'right'}).appendTo( $node );

			
			$fromInputTag.off('change').on('change', function(event){
				event.stopPropagation();

				let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
				dataPacket.term = term;

				let rangeSearch = $rangeSearch.find('input').first().prop('checked');
				if( rangeSearch ){
					dataPacket.rangeSearch = rangeSearch;
					dataPacket.from = Util.toSafeNumber( $fromInputTag.val() );
					dataPacket.to = Util.toSafeNumber( $toInputTag.val() );
				}
				else{
					let keywords = $(this).val().split( Term.KEYWORD_REG_EXPR );
					dataPacket.keywords = keywords.map( keyword=>Util.toSafeNumber(keyword) )
													.filter( keyword => Util.isNotEmpty(keyword) );
				}

				Util.fire(
					Events.SEARCH_KEYWORD_CHANGED,
					dataPacket
				);
			});

			$toInputTag.off('change').on('change', function(event){
				event.stopPropagation();

				let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
				dataPacket.term = term;
				dataPacket.rangeSearch = true;
				dataPacket.from = Util.toSafeNumber($fromInputTag.val());
				dataPacket.to = Util.toSafeNumber($(this).val());
				dataPacket.$source = $(this);

				Util.fire(
					Events.SEARCH_KEYWORD_CHANGED,
					dataPacket
				);
			});

			$rangeSearch.off('change').on('change', function(event){
				let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
				dataPacket.term = term;
				dataPacket.rangeSearch = Util.toSafeBoolean( $(this).find('input').first().prop('checked') );
				
				if( dataPacket.rangeSearch === true ){
					let keywords = $fromInputTag.val().split( Term.KEYWORD_REG_EXPR );
					dataPacket.from = Util.toSafeNumber( keywords[0] );
					dataPacket.to = Util.toSafeNumber( $toInputTag.val() );
					$curlingSpan.show();
					$toInputTag.show();
				}
				else{
					let keywords = $fromInputTag.val().split( Term.KEYWORD_REG_EXPR );
					dataPacket.keywords = keywords.map( keyword=>Util.toSafeNumber(keyword) )
													.filter( keyword => Util.isNotEmpty(keyword) );
					$curlingSpan.hide();
					$toInputTag.hide();
				}

				Util.fire(Events.SEARCH_KEYWORD_CHANGED, dataPacket );
			});
			
			return $node;
		}

		$getEditorNumericNode(){
			let term = this;

			let valueName = NAMESPACE + term.termName;
			let uncertaintyId = NAMESPACE + term.termName + '_uncertainty';

			let $node = 
					$('<div style="width:100%;max-width:100%; margin:0 0 0 15px; padding:0;">');

			if( Util.isNotEmpty( this.minValue) ){
				$('<span style="display:inline-block;margin:0 3x 0 3px;max-width:fit-content;text-align:center;width:fit-content;"><strong>' +
					this.minValue + '</strong></span>').appendTo( $node );
				
				let minBoundaryText = '&lt;';
				if( this.minBoundary ){
					minBoundaryText = '&le;';
				}

				$('<span style="display:inline-block;;margin:0 3x 0 3px;max-width:fit-content;width:fit-content;text-align:center;margin:3px 3px;"><strong>' +
						minBoundaryText + '</strong></span>').appendTo( $node );

			}
			
			//let $inputCol = $('<span style="display:inline-block; min-width:30%;width:-webkit-fill-available;">').appendTo($node);

			let eventFuncs = {
				change: function( event ){
					event.stopPropagation();

					let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
					dataPacket.term = term;
					dataPacket.attribute = TermAttributes.VALUE;
					dataPacket.value = $(this).val();
					dataPacket.$source = $(this);

					Util.fire( Events.TERM_VALUE_CHANGED, dataPacket );					
				}
			};
			FormUIUtil.$getTextInput( 
					valueName, 
					valueName, 
					'text',  
					this.getLocalizedPlaceHolder(), 
					this.mandatory, 
					this.disabled, 
					this.#value, 
					eventFuncs )
					.css({
						'max-width': '150px',
						'display': 'inline-block'
					})
					.appendTo($node);

			if( this.uncertainty ){
				$('<div style="display:inline-block;margin:0 3x 0 3px;max-width:fit-content;width:fit-content;text-align:center;margin:0 5px 0 5px;"><strong>&#xB1;</strong></div>')
					.appendTo( $node );

				//$inputCol = $('<div style="display:inline-block; min-width:20%;width:fit-content;">').appendTo($controlSection);

				eventFuncs = {
					change: function( event ){
						event.stopPropagation();
	
						let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.term = term;
						dataPacket.attribute = TermAttributes.UNCERTAINTY_VALUE;
						dataPacket.value = $(this).val();
						dataPacket.$source = $(this);
	
						Util.fire( Events.TERM_VALUE_CHANGED, dataPacket );					
					}
				};
				FormUIUtil.$getTextInput( 
					uncertaintyId, 
					valueName, 
					'text', 
					'', 
					false, 
					this.disabled, 
					this.uncertaintyValue, 
					eventFuncs )
					.css({
						'max-width': '100px',
						'display': 'inline-block'
					})
					.appendTo($node);
			}

			if( !!this.unit ){
				$('<div style="display:inline-block;margin:0 3x 0 3px;max-width:fit-content;text-align:center;margin:1rem 10px 0 10px;">' +
						this.unit + '</div>').appendTo( $node );
			}

			if( Util.isNotEmpty(this.maxValue) ){
				let maxBoundaryText = this.maxBoundary ? '&le;' : '&lt;';
				
				$('<div style="display:inline-block;margin:0 3x 0 3px;max-width:fit-content;width:fit-content;text-align:center;margin:0 3px 0 3px;"><strong>' +
					maxBoundaryText + '</strong></div>').appendTo( $node );

				$('<div style="display:inline-block;margin:0 3x 0 3px;max-width:fit-content;width:fit-content;text-align:center;"><strong>' +
					this.maxValue + '</strong></div>').appendTo( $node );
			}

			
			$node.css({
				'width': this.cssWidth ? this.cssWidth : '100%',
				'max-width': '100%'
			});
			
			return $node;
		}
		
		$render( forWhat, prefix ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			let term = this;

			let name = NAMESPACE + term.termName;

			let $section = $('<div class="edit-area">');

			let $labelNode = this.$getLabelNode( forWhat, prefix ).appendTo( $section );

			$section.append( this.$getControlNode( forWhat) );

			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection(
									$section, 
									this.getPreviewPopupAction() );
			}
			else if( forWhat === Constants.FOR_EDITOR ){
				this.$rendered = FormUIUtil.$getEditorRowSection( $section );
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				this.$rendered = FormUIUtil.$getSearchRowSection( $section );
			}

			return this.$rendered;
		}

		validate( val ){
			if( val === undefined || val === null ){
				return true;
			}

			if( typeof val !== 'number' )	return false;

			return this.minmaxValidation( val );
		}

		minValidation( value ){
			let validation = true;

			if( Util.isSafeNumber(this.minValue) ){
				let errorMsg;
				if( !!this.minBoundary ){
					if( value < this.minValue  ){
						validation = false;
						errorMsg = Liferay.Language.get('keyword-must-larger-than-or-equal-to-the-minimum-value') +
									'<br>Minimum Value: ' + this.minValue;
					}
				}
				else{
					if( value <= this.minValue ){
						validation = false;
						errorMsg = Liferay.Language.get('keyword-must-larger-than-the-minimum-value') +
									'<br>Minimum Value: ' + this.minValue;
					}
				}

				if( validation === false ){
					FormUIUtil.showError(
						Constants.ERROR,
						Liferay.Language.get('out-of-range-error'),
						errorMsg,
						{
							ok: {
								text: 'OK',
								btnClass: 'btn-blue'
							}
						}
					);
					return false;
				}
			}

			return true;
		}

		maxValidation( value ){
			let validation = true;

			if( Util.isSafeNumber(this.maxValue) ){
				let errorMsg;
				if( !!this.maxBoundary ){
					if( value > this.maxValue ){
						validation = false;
						errorMsg = Liferay.Language.get('keyword-must-less-than-or-equal-to-the-maximum-value') +
										'<br>Maximum Value: ' + this.maxValue;
					}
				}
				else{
					if( value >= this.maxValue ){
						validation = false;
						errorMsg = Liferay.Language.get('keyword-must-less-than-the-maximum-value') +
										'<br>Maximum Value: ' + this.maxValue;
					}
				}

				if( validation === false ){
					FormUIUtil.showError(
						Constants.ERROR,
						Liferay.Language.get('out-of-range-error'),
						errorMsg,
						{
							ok: {
								text: 'OK',
								btnClass: 'btn-blue'
							}
						}
					);
					return false;
				}
			}

			return true;
		}

		minmaxValidation( value ){
			return this.minValidation( value ) && this.maxValidation( value );
		}

		hasValue(){
			return Util.isSafeNumber(this.#value);
		}

		hasUncertainty(){
			return Util.isSafeNumber(this.#uncertaintyValue);
		}

		getLocalizedPlaceHolder( locale=CURRENT_LANGUAGE ){
			if( !this.placeHolder || this.placeHolder.isEmpty() ){
				return '';
			}
			else{
				return this.placeHolder.getText(locale);
			}
		}

		parse( json ){
			let unparsed = super.parse( json );
			let invalid = new Object();

			let self = this;
			Object.keys( unparsed ).forEach((key, index)=>{
				switch( key ){
					case 'minBoundary':
					case 'maxBoundary':
					case 'unit':
					case 'uncertainty':
					case 'sweepable':
					case 'minValue':
					case 'maxValue':
					case 'inputSize':
					case 'lineBreak':
						self[key] = json[key];
						break;
					case 'value':
						if( typeof json.value === 'object' ){
							self.value = json.value.value;
							self.uncertaintyValue = json.value.uncertainty;
						}
						else if( typeof json.value === 'number' ){
							self.value = json.value;
						}
						break;
					case 'placeHolder':
						self.placeHolder = new LocalizedObject( json[key] );
						break;
					default:
						invalid[key] = json[key];
				}
			});
		}
		
		clone(){
			return new NumericTerm( this.toJSON() );
		}

		toJSON(){
			let json = super.toJSON();
			
			if( Util.isSafeNumber(this.minValue) )	json.minValue = this.minValue;
			if( Util.isSafeBoolean(this.minBoundary) )	json.minBoundary = this.minBoundary;
			if( Util.isSafeNumber(this.maxValue) )	json.maxValue = this.maxValue;
			if( Util.isSafeBoolean(this.maxBoundary) )	json.maxBoundary = this.maxBoundary;
			if( Util.isNotEmpty(this.unit) )	json.unit = this.unit;
			if( Util.isSafeBoolean(this.uncertainty) )	json.uncertainty = this.uncertainty;
			if( this.hasValue() )	json.value = this.value;
			if( Util.isSafeNumber(this.uncertaintyValue) )	json.uncertaintyValue = this.uncertaintyValue;
			if( Util.isSafeBoolean(this.sweepable) )	json.sweepable = this.sweepable;
			if( this.placeHolder && !this.placeHolder.isEmpty() ){
				json.placeHolder = this.placeHolder.toJSON();
			}
			json.inputSize = this.inputSize;
			json.lineBreak = this.lineBreak;

			return json;

		}

	}
	
	/* 3. ListTerm */
	class ListTerm extends Term {
		static DISPLAY_STYLE_SELECT = 'select';
		static DISPLAY_STYLE_RADIO = 'radio';
		static DISPLAY_STYLE_CHECK = 'check';
		
		#value;
		#options;
		#placeHolder;
		#displayStyle;
		#multiple;

		constructor( jsonObj ){
			super('List');

			this.displayStyle = ListTerm.DISPLAY_STYLE_SELECT;

			if( Util.isNotEmpty(jsonObj) ) this.parse(jsonObj);
		}

		get value() { return this.#value; }
		set value(value){ 
			if( Util.isNotEmptyString(value) ){
				if( value.startsWith('[') && value.endsWith(']') ){
					this.#value = JSON.parse(value);
				}
				else{
					let values = value.split(',');
					values = values.map(val=>val.trim())
								   .filter(val=>this.validate(val));

					this.#value = (values.length > 0) ? values : undefined;
				}
			}
			else if( Util.isNonEmptyArray(value) ){
				this.#value = value;
			}
			else {
				this.#value = undefined;
			}
		}
		get options() {return this.#options;}
		set options(val){this.#options = val;}
		get displayStyle() {return this.#displayStyle;}
		set displayStyle(val){this.#displayStyle = val;}
		get multiple() {return this.#multiple;}
		set multiple(val){this.#multiple = val;}
		get placeHolder(){ return this.#placeHolder; }
		set placeHolder(val){ this.#placeHolder = Util.toSafeLocalizedObject(val, this.placeHolder); }

		hasSlaves(){
			let hasSlaves = false;
			if( Util.isNonEmptyArray(this.options) ){
				this.options.every( option => {
					if( option.hasSlaves() ){
						hasSlaves = true;
	
						return Constants.STOP_EVERY;
					}
	
					return Constants.CONTINUE_EVERY;
				});
			}

			return hasSlaves;
		}

		addOption( option ){
			if( !this.options ){
				this.options = new Array();
			}

			this.#options.push( option );
		}

		getOptions( optionValues, included=true ){
			if( included ){
				return this.options.filter(option=> optionValues.includes(option.value));
			}
			else{
				return this.options.filter(option=> !optionValues.includes(option.value));
			}
		}

		deleteAllSlaveTerms(){
			this.#options.forEach(option=>{
				option.slaveTerms = undefined;
			});
		}

		/**
		 * Gets all slave term names of the ListTerm
		 * @returns Array of term names
		 */
		getAllSlaveTerms(){
			let termNames = new Array();
			this.#options.forEach( option => {
				if( Util.isNotEmpty(option.slaveTerms) ){
					termNames = termNames.concat( option.slaveTerms );
				}
			});

			return termNames;
		}

		removeSlaveTerm( termName ){
			this.#options.forEach(option=>{
				option.removeSlaveTerm( termName );
			});
		} 

		getLocalizedPlaceHolder( locale=CURRENT_LANGUAGE ){
			if( !this.placeHolder || this.placeHolder.isEmpty() ){
				return '';
			}
			else{
				return this.placeHolder.getText(locale);
			}
		}

		$getControlNode( forWhat, prefix ){
			let term = this;

			let controlName = prefix ? NAMESPACE + this.termName + '_' + prefix : 
										NAMESPACE + this.termName;
			let value = this.hasValue() ? this.value : null;
			
			let $node;
			if( forWhat === Constants.FOR_SEARCH ){
				$node = FormUIUtil.$getFieldsetTag( 
					null, 
					null, 
					this.mandatory, 
					this.getLocalizedTooltip() );

				this.options.forEach((option, index)=>{
						let selected = false;
						$node.append( FormUIUtil.$getCheckboxTag( 
													controlName+'_'+(index+1),
													controlName,
													option.labelMap[CURRENT_LANGUAGE],
													selected,
													option.value,
													this.disabled,
													{} ) );
				});
					
				$node.change(function(event){
					event.stopPropagation();

					let checkedValues = new Array();

					$.each( $(this).find('input[type="checkbox"]:checked'), function(){
						checkedValues.push( $(this).val() );
					});

					let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
					dataPacket.term = term;
					dataPacket.keywords = checkedValues;
					
					Util.fire(
						Events.SEARCH_KEYWORD_CHANGED,
						dataPacket
					);
				});
			}
			else if( forWhat === Constants.FOR_EDITOR || forWhat === Constants.FOR_PREVIEW ){
				if( this.displayStyle === ListTerm.DISPLAY_STYLE_SELECT ){
					let optionValue = this.hasValue() ? this.#value : '';
					
					$node = FormUIUtil.$getMultiSelectTag(
									controlName,
									controlName, 
									this.options, 
									optionValue, 
									this.getLocalizedPlaceHolder(),
									this.multiple,
									this.disabled)
									.css('margin-left', '15px');

					$node.change(function(event){
						//event.stopPropagation();

						let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.term = term;
						dataPacket.attribute = TermAttributes.VALUE;
						dataPacket.value = term.multiple ? $(this).val() : [$(this).val()];
						dataPacket.$source = $(this);
						Util.fire(
							Events.TERM_VALUE_CHANGED,
							dataPacket
						);
					});
				}
				else if( this.displayStyle === ListTerm.DISPLAY_STYLE_RADIO ){
					$node = FormUIUtil.$getFieldsetTag( 
									null, 
									null, 
									this.mandatory, 
									this.getLocalizedTooltip() ).css('margin-left', '15px');

					let optionValue = value ? value[0] : '';
					this.options.forEach((option, index)=>{
							let selected = optionValue ? (option.value === optionValue) : 
														 option.selected;
							FormUIUtil.$getRadioButtonTag( 
											controlName+'_'+(index+1),
											controlName, 
											option,
											selected,
											this.disabled ).appendTo($node);
					});

					$node.change(function(event){
						event.stopPropagation();

						let changedVal = $(this).find('input[type="radio"]:checked').val();

						let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.term = term;
						dataPacket.attribute = TermAttributes.VALUE;
						dataPacket.value = [changedVal];
						dataPacket.$source = $(this);

						Util.fire(
							Events.TERM_VALUE_CHANGED,
							dataPacket
						);
					});
				}
				else{ //For Checkbox
					$node = FormUIUtil.$getFieldsetTag( 
						null, 
						null, 
						this.mandatory, 
						this.getLocalizedTooltip() ).css('margin-left', '15px');

					this.options.forEach((option, index)=>{
							let selected = this.hasValue() ? this.#value.includes(option.value) : false;
							$node.append( FormUIUtil.$getCheckboxTag( 
														controlName+'_'+(index+1),
														controlName,
														option.labelMap[CURRENT_LANGUAGE],
														selected,
														option.value,
														this.disabled,
														{} ) );
					});
						
					$node.change(function(event){
						event.stopPropagation();

						let checkedValues = new Array();

						$.each( $(this).find('input[type="checkbox"]:checked'), function(){
							checkedValues.push( $(this).val() );
						});

						let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.term = term;
						dataPacket.attribute = TermAttributes.VALUE;
						dataPacket.value = checkedValues;
						dataPacket.$source = $(this);
						
						Util.fire(
							Events.TERM_VALUE_CHANGED,
							dataPacket
						);
					});
				}

				$node.css({
					'width': this.cssWidth ? this.cssWidth : '100%',
					'max-width': '100%'
				});
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				controlName += '_pdf';

				$node = $('<div style="margin:0px 10px 10px 10px;">');
				if( this.displayStyle === ListTerm.DISPLAY_STYLE_RADIO ||
					(this.displayStyle === ListTerm.DISPLAY_STYLE_SELECT && !this.multiple) ){
					this.options.forEach((option, index)=>{
							FormUIUtil.$getRadioButtonTag( 
											controlName+'_'+(index+1),
											controlName, 
											option,
											false,
											this.disabled )
											.css({
												'background-color': 'white'
											})
											.appendTo($node);
					});
				}
				else{ //For Checkbox
					this.options.forEach((option, index)=>{
							$node.append( FormUIUtil.$getCheckboxTag( 
														controlName+'_'+(index+1),
														controlName,
														option.labelMap[CURRENT_LANGUAGE],
														false,
														'',
														false,
														{} )
														.css({
															'background-color': 'white'
														}) );
					});
				}
			}

			return $node;
		}

		$render( forWhat, prefix ){
			if( this.$rendered ){
				this.$rendered.remove();
			}
			
			let $section = $('<div class="edit-area" style="padding-right:15px;">');

			let $label = this.$getLabelNode( forWhat, prefix ).appendTo( $section );

			$section.append( this.$getControlNode( forWhat ) );
			
			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection(
										$section, 
										this.getPreviewPopupAction() );

			}
			else if( forWhat === Constants.FOR_EDITOR ){
				this.$rendered = FormUIUtil.$getEditorRowSection( $section );
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				this.$rendered = FormUIUtil.$getSearchRowSection( $section );
			}

			return this.$rendered;
		}

		validate( val ){
			let availValues = this.options.map(option=> option.value);

			return availValues.includes(val);
		}

		disable( disable=true ){
			this.disable = disable;
			this.$rendered.find('select, input').prop('disabled', this.disable);
		}

		hasValue(){
			return Util.isNonEmptyArray(this.value);
		}

		multiSelectize(){
			if( !this.multiple )	return;

			this.$rendered.find('select[multiple]').multiSelect({
				noneText: this.getLocalizedPlaceHolder()
			});
		}

		parse( json ){
			let unparsed = super.parse( json );
			let unvalid = new Object();
			
			let self = this;
			Object.keys( unparsed ).forEach((key)=>{
				switch(key){
					case 'value':
						self.value = json.value;
						break;
					case 'displayStyle':
						self.displayStyle = json.displayStyle;
						break;
					case 'placeHolder':
						self.placeHolder = json.placeHolder;
						break;
					case 'multiple':
						self.multiple = json.multiple;
						break;
					case 'options':
						if( typeof json.options === 'string' ){
							json.options = JSON.parse( json.options );
						}
						json.options.forEach(option => {
							if( option.hasOwnProperty('labelMap') ){
								option.label = option.labelMap;
							}

							self.addOption(new ListOption(
									option.label,
									option.value,
									option.selected,
									option.hasOwnProperty('slaveTerms') ? 
											option.slaveTerms : option.activeTerms,
									option.disabled
							));
						});
						break;
					default:
						unvalid[key] = json[key];
						console.log('Unvalid term attribute: '+key, json[key]);
				}
			});
			
			//this.value = json.value ? JSON.parse(json.value) : [];
		}
	
		clone(){
			return new ListTerm( this.toJSON() );
		}

		toJSON(){
			let json = super.toJSON();
			
			json.displayStyle = this.displayStyle;
			json.multiple = this.multiple ? true : false;

			if( Util.isSafeLocalizedObject(this.placeHolder) ){
				json.placeHolder = this.placeHolder.localizedMap;
			}

			if( this.hasValue() ){
				json.value = this.value;
			}

			if( Util.isNonEmptyArray(this.options) ){
				json.options = this.options.map(option=>option.toJSON());
			}
			
			return json;
		}
	}
	
	/* 4. EMailTerm */
	class EMailTerm  extends Term{
		static SERVER_LIST = [
			'naver.com',
			'daum.net',
			'gmail.com',
			'nate.com',
			'msn.com'
		];

		#value;

		constructor( jsonObj ){
			super( 'EMail' );

			if( jsonObj ){
				this.parse( jsonObj );
			}
		}

		get value(){
			if( Util.isNonEmptyArray(this.#value) ){
				return this.#value.join('@');
			}
		}
		set value( value ){
			if( Util.isNotEmptyString(value) ){
				let parts = value.split('@');
				if( parts.length === 2 ){
					this.#value = parts;
					return;
				}
			}
			else if( Util.isNonEmptyArray(value) && value.length === 2 ){
				this.#value = value;
				return;
			}
			
			this.#value = undefined;
		}

		get emailId(){ 
			if( this.#value instanceof Array )	return this.#value[0];
		};
		set emailId( id ){
			if( !(this.#value instanceof Array) ){
				this.#value = new Array(2);
			}

			this.#value[0] = id;
		}

		get server(){ 
			if( this.#value instanceof Array )	return this.#value[1];
		};
		set server( server ){
			if( !this.#value instanceof Array ){
				this.#value = new Array(2);
			}

			this.#value[1] = server;
		}

		$getControlNode( forWhat ){
			let controlId = NAMESPACE + this.termName;
			let $node;

			let self = this;
			if( forWhat === Constants.FOR_EDITOR ||
				forWhat === Constants.FOR_PREVIEW ){
				$node = $('<div>');

				let eventFuncs = {
					'change' : function(event){
						event.stopPropagation();
						
						let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.term = self;
						dataPacket.attribute = 'emailId';
						dataPacket.value = $(this).val();
						dataPacket.$source = $(this);
						
						Util.fire(
							Events.TERM_VALUE_CHANGED,
							dataPacket
							);
					}
				};

				FormUIUtil.$getTextInput(
					controlId + '_emailId',
					controlId + '_emailId',
					'text',
					'',
					this.mandatory,
					this.disabled,
					this.emailId,
					eventFuncs).css({
						'width':'45%',
						'max-width': '150px',
						'display':'inline-block'
				}).appendTo( $node );

				$('<span style="max-width:10%;display:inline-block;">@</span>').appendTo( $node );

				eventFuncs = {
					'change': function(event){
						event.stopPropagation();

						let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.term = self;
						dataPacket.attribute = 'server';
						dataPacket.value = $(this).val();
						dataPacket.$source = $(this);
						Util.fire(
							Events.TERM_VALUE_CHANGED,
							dataPacket
						);
					}
				};

				FormUIUtil.$getTextInput(
					controlId + '_server',
					controlId + '_server',
					'text',
					'',
					this.mandatory,
					this.disabled,
					this.server,
					eventFuncs)
					.attr( 'list', NAMESPACE+'servers')
					.css({
						'width':'45%',
						'max-width': '150px',
						'display':'inline-block'
					}).appendTo($node);
								
				let $servers = $('<datalist id="' + NAMESPACE + 'servers">').appendTo( $node );

				EMailTerm.SERVER_LIST.forEach( server => {
					$('<option value="' + server + '">').appendTo( $servers );
				});

				$node.css({
					'width': this.cssWidth ? this.cssWidth : '100%',
					'max-width': '100%',
					'margin-left': '15px'
				});
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				$node = $('<div>');

				let $input = $('<input class="form-control">').prop({
					'id': controlId,
					'name': controlId,
					'placeHolder': Liferay.Language.get('search-keywords')
				}).css({
					'width': this.cssWidth ? this.cssWidth : '100%'
				}).appendTo( $node );

				$input.change( function(event){
					event.stopPropagation();

					let keywords = $(this).val();

					if( Util.isEmpty(keywords) ){
						keywords = null;
					}
					else{
						keywords = keywords.split( Term.KEYWORD_REG_EXPR );
					}

					let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
					dataPacket.term = self;
					dataPacket.keywords = keywords

					Util.fire(Events.SEARCH_KEYWORD_CHANGED, dataPacket );
				});
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				$node = $('<input>').prop({
					'id': controlId + '_pdf',
					'name': controlId  + '_pdf'
				}).css({
					'width': this.cssWidth ? this.cssWidth : '100%',
					'border': '1px solid #dddddd'
				});
			}

			return $node;
		}

		$render( forWhat, prefix ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			let $section = $('<div>');

			$section.append( this.$getLabelNode( forWhat, prefix ) );
			$section.append( this.$getControlNode( forWhat ) );

			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection( 
										$section,
										this.getPreviewPopupAction() );
			}
			else if( forWhat === Constants.FOR_EDITOR ){
				this.$rendered = FormUIUtil.$getEditorRowSection( $section );
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				this.$rendered = FormUIUtil.$getSearchRowSection( $section );
			}

			return this.$rendered;
		}

		hasValue(){
			return 	Array.isArray(this.#value) && 
					Util.isNotEmpty(this.#value[0]) && 
					Util.isNotEmpty(this.#value[1]);
		}

		validate( email ){
			return email.includes('@');
		}

		parse( jsonObj ){
			let unparsed = super.parse( jsonObj );

			this.value = jsonObj.value;
		}

		clone(){
			return new EMailTerm( this.toJSON() );
		}

		toJSON(){
			let json = super.toJSON();

			if( this.hasValue() ){
				json.value = this.value;
			}

			return json;
		}
	}
	
	/* 5. AddressTerm */
	class AddressTerm extends Term{
		#value;

		constructor( jsonObj ){
			super( 'Address' );

			if( jsonObj ){
				this.parse( jsonObj );
			}
		}

		get value(){
			if( Util.isNonEmptyArray(this.#value) ){
				return this.#value.join(', ');
			}
			
			return '';
		}
		set value( value ){
			if( Util.isNotEmptyString(value) ){
				this.#value = value.split(', ')
				return;
			}
			else if( Util.isNonEmptyArray(value) ){
				this.#value = value;
				return;
			}
			
			this.#value = undefined;
		}

		get zipcode(){	
			if( Array.isArray(this.#value) )
				return this.#value[0]; 
		}
		set zipcode( code ){
			if( !Array.isArray(this.#value) ){
				this.#value = new Array(3);
			}
			this.#value[0] = code; 
		}
		get street(){	
			if( Array.isArray(this.#value) )
				return this.#value[1]; 
		}
		set street( street ){
			if( !Array.isArray(this.#value) ){
				this.#value = new Array(3);
			}
			this.#value[1] = street; 
		}
		get detailAddr(){	
			if( Array.isArray(this.#value) )
				return this.#value[2]; 
		}
		set detailAddr( addr ){
			if( !Array.isArray(this.#value) ){
				this.#value = new Array(3);
			}

			this.#value[2] = addr; 
		}

		$getControlNode( forWhat ){
			let $node;
			if( forWhat === Constants.FOR_PREVIEW || forWhat === Constants.FOR_EDITOR ){
				$node = this.$getEditAddressNode();
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				$node = this.$getSearchAddressNode();
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				$node = this.$getFormPDFNode();
			}

			return $node;
		}

		$getEditAddressNode(){
			let $node = $('<div style="padding-right:15px;"></div>');
			let controlId = NAMESPACE+this.termName;

			let self = this;

			let $inputZipcode = $('<input type="text" class="form-control">').prop({
					'id': controlId + '_zipcode',
					'name': controlId + '_zipcode',
					'required': this.mandatory,
					'disabled': true
				}).css({
					'width':'45%',
					'display':'inline-block',
					'border-color':'#e7e7ed'
				}).appendTo( $node );
					
			if( this.hasValue() ){
				$inputZipcode.val( this.zipcode );
			}

			let $searchZipcodeBtn = $('<span id="' + NAMESPACE + 'searchZipcode" class="btn btn-default" style="margin-left:10px;font-size:0.8rem;font-weight:400;">' + 
										Liferay.Language.get('search-zipcode') + 
										'</span>' ).appendTo($node);
										  
			let $resetBtn = $('<span class="btn btn-default" style="margin-left:5px;font-size:0.8rem;font-weight:400;">' +
										Liferay.Language.get('reset') +
										'</span>').appendTo($node);

			let $address = $('<input class="form-control" ' + 
									'id="' + controlId + '_address" ' +
									'name="' + controlId + '_address" ' +
									'disabled '+
									'style="border-color:#e7e7ed;" ' +
									'/>' ).appendTo( $node );
			if( this.hasValue() ){
				$address.val( this.street );
			}

			let $detailNode = $('<div>').appendTo( $node );
			let $detailLabel = $('<span style="margin-right: 5px;display:inline-block;font-size:0.8rem;font-weight:400;">'+Liferay.Language.get('detail-address')+':</span>').appendTo($detailNode);

			let $detailAddr = $('<input class="form-control" ' + 
										'id="' + controlId + '_detailAddr" ' +
										'name="' + controlId + '_detailAddr" ' +
										'aria-required="true" ' +
										'style="display:inline-block;max-width:76%;border-color:#e7e7ed;" '+
										'disabled '+
										'/>' ).appendTo( $detailNode );
			if( this.hasValue() ){
				$detailAddr.val( this.detailAddr );
				$detailAddr.prop('disabled', this.disabled);
			}

			$detailAddr.on('focusout', (event) => {
				if( !$detailAddr.val() ){
					$.alert( 'Detail Address should be provided...');
				}
			});
							
			$resetBtn.click( function(event){
				event.stopPropagation();

				self.value = undefined;

				$inputZipcode.val('');
				$address.val('');
				$detailAddr.val('');

				$detailAddr.trigger('change');
			});

			$searchZipcodeBtn.click( function( e ){
				new daum.Postcode({
					width: 500,
					height: 600,
					oncomplete: function(data) {
						self.value = new Array(3);
						$inputZipcode.val( data.zonecode );

						let address;

						if( data.userSelectionType === 'R'){
							address = CURRENT_LANGUAGE === 'ko_KR' ? data.address : data.addressEnglish.replaceAll(',', ' ');
						}
						else{
							address = CURRENT_LANGUAGE === 'ko_KR' ? data.roadAddres : data.roadAddressEnglish.replaceAll(',', ' ');
						}

						$address.val( address );
						
						$detailAddr.prop('disabled', false).trigger('focus');

						let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = self;
						dataPacket.attribute = 'zipcode';
						dataPacket.zipcode = data.zonecode;
						dataPacket.street = address;
						dataPacket.$source = $(this);

						Util.fire(
							Events.TERM_VALUE_CHANGED, 
							dataPacket );						

					}
				}).open();
			});

			$detailAddr.off('change').on('change', function(event){
				event.stopPropagation();

				let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
				dataPacket.term = self;
				dataPacket.attribute = 'detailAddr';
				dataPacket.value = $(this).val().replaceAll(',', ' ');
				dataPacket.$source = $(this);
				Util.fire(
					Events.TERM_VALUE_CHANGED,
					dataPacket
				);
			});

			$node.css({
				'width': this.cssWidth ? this.cssWidth : '100%',
				'max-width': '100%',
				'margin-left': '15px'
			})

			return $node;
		}

		$getSearchAddressNode(){
			let controlName = NAMESPACE + this.termName;
			
			let $input = $( '<input type="text" class="form-control">' );
				
			$input.prop({
				id: controlName,
				name: controlName,
				placeholder: Liferay.Language.get('search-keywords')
			});
				
			let self = this;
			$input.change(function(event){
				event.stopPropagation();

				let keywords = $(this).val();

				if( Util.isEmpty(keywords) ){
					keywords = null;
				}
				else{
					keywords = keywords.split( Term.KEYWORD_REG_EXPR );
				}

				let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
				dataPacket.term = self;
				dataPacket.keywords = keywords

				Util.fire(Events.SEARCH_KEYWORD_CHANGED, dataPacket );
			});
		
			return $input;
		}

		$getFormPDFNode(){
			let controlName = NAMESPACE + this.termName + '_pdf';
			
			let $input = $( '<input type="text">' );
				
			$input.prop({
				id: controlName,
				name: controlName
			}).css({
				'width': this.width ? this.width : '100%',
				'border': '1px solid #dddddd'
			});

			return $input;
		}

		$render( forWhat, prefix ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			let $section = $('<div>');

			let $label = this.$getLabelNode( forWhat, prefix ).appendTo( $section );
			
			$section.append( this.$getControlNode( forWhat ) );
			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection( 
												$section,
												this.getPreviewPopupAction() ) ;
			}
			else if( forWhat === Constants.FOR_EDITOR ){
				this.$rendered = FormUIUtil.$getEditorRowSection( $section );
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				this.$rendered = FormUIUtil.$getSearchRowSection( $section );
			}

			return this.$rendered;
		}

		hasValue(){
			return (Array.isArray( this.#value ) &&
					this.#value[0] && this.#value[1] && this.#value[2]) ? true : false;
		}

		parse( jsonObj ){
			super.parse( jsonObj );

			this.value = jsonObj.value ? jsonObj.value : undefined;
		}

		clone(){
			return new AddressTerm( this.toJSON() );
		}

		toJSON(){
			let json = super.toJSON();

			if( this.hasValue() ){
				json.value = this.value;
			}
			
			return json;
		}
	}

	/* 6. MatrixTerm */
	class MatrixTerm extends Term{
		static DEFAULT_ROWS = 3;
		static DEFAULT_COLUMNS = 3;
		static DEFAULT_COLUMN_WIDTH = 2;

		#value;
		#rows;
		#columns;
		#columnWidth;

		constructor( jsonObj ){
			super( 'Matrix' );
			
			this.#rows = MatrixTerm.DEFAULT_ROWS;
			this.#columns = MatrixTerm.DEFAULT_COLUMNS;
			this.#columnWidth = MatrixTerm.DEFAULT_COLUMN_WIDTH;
			
			

			if( jsonObj ){
				this.parse( jsonObj );
			}
		}

		get value(){ return this.#value; }
		set value( value ){ this.#value = value; }
		get rows(){ return this.#rows; }
		set rows( rows ){ this.#rows = Util.toSafeNumber( rows ); }
		get columns(){ return this.#columns; }
		set columns( columns ){ this.#columns = Util.toSafeNumber( columns ); }
		get columnWidth(){ return this.#columnWidth; }
		set columnWidth( width ){ this.#columnWidth = Util.toSafeNumber( width ); }

		getCell( row, col ){
			if( this.hasValue() )
				return this.#value[row][col];
		}

		setCell( row, col, value ){
			let safeVal = Util.toSafeNumber( value );
			if( !isNaN(safeVal) ){
				if( !Array.isArray(this.#value) ){
					this.assignEmptyValue();
				}

				this.#value[row][col] = safeVal;
			}
		}

		assignEmptyValue(){
			this.#value = new Array();
				
			for( let r=0; r<this.rows; r++){
				this.#value[r] = new Array();
			}
		}

		hasValue(){
			if( !Util.isNonEmptyArray(this.value) )	return false;

			for( let r=0; r<this.rows; r++ ){
				if( !Util.isNonEmptyArray(this.value[r]) )	return false;
				for( let c=0; c<this.columns; c++ ){
					if( !Util.isSafeNumber(this.value[r][c]) ){
						return false;
					}
				}
			}

			return true;
		}

		$getControlNode( forWhat ){
			//let $node = $('<div>');
			
			//let $table = $('<table>').appendTo( $node );
			if( forWhat === Constants.FOR_PREVIEW ||
				forWhat === Constants.FOR_EDITOR ){
				let $table = $('<table style="margin-left:15px;">');
				for( let r=0; r < this.#rows; r++ ){
					let $tr = $('<tr style="line-height:1.8rem;">').appendTo( $table ) ;
					if( r === 0 ){
						$tr.append( $('<td><span style="font-size:1rem;">&#9121;</span></td>') );
					}
					else if( r > 0 && r < this.#rows - 1 ){
						$tr.append( $('<td><span style="font-size:1rem;">&#9122;</span></td>') );
					}
					else{
						$tr.append( $('<td><span style="font-size:1rem;">&#9123;</span></td>') );
					}
					
					for( let c=0; c<this.#columns; c++){
						let $td = $('<td>').appendTo( $tr );
						let $input = $('<input type="text" ' + 
										'name="' + NAMESPACE + this.termName+'_'+r+'_'+c+'"/>'
									).appendTo( $td );
						$input.css({
							'height': '1.5rem',
							'padding': '0',
							'text-align': 'right',
							'margin-left': '3px',
							'margin-right':'3px',
							'width': this.#columnWidth+'rem'
						});
						
						if( Util.isEmpty( this.#value[r] ) ){
							this.#value[r] = new Array();
						}
						
						if( Util.isSafeNumber(this.#value[r][c]) ){
							$input.val( this.#value[r][c] );
						}
						else{
							$input.val('');
						}
						
						if( this.disabled ){
							$input.prop('disabled', true);
						}
						else{
							let matrixTerm = this;
							$input.change(function(event){
								event.stopPropagation();
								
								let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
								dataPacket.term = matrixTerm;
								dataPacket.attribute = 'cell';
								dataPacket.row = r;
								dataPacket.column = c;
								dataPacket.value = $(this).val();
								dataPacket.$source = $(this);
								Util.fire(
									Events.TERM_VALUE_CHANGED,
									dataPacket
								);
							});
						}
					}
					
					if( r === 0 ){
						$tr.append( $('<td><span style="font-size:1rem;">&#9124;</span></td>') );
					}
					else if( r > 0 && r < this.rows - 1 ){
						$tr.append( $('<td><span style="font-size:1rem;">&#9125;</span></td>') );
					}
					else{
						$tr.append( $('<td><span style="font-size:1rem;">&#9126;</span></td>') );
					}
				}
				
				return $table;
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				let term = this;
				let controlName = NAMESPACE + this.termName;

				let $node = $('<div>');

				let $fromInputTag = FormUIUtil.$getTextInput(
					controlName+'_from',
					controlName,
					'text',
					Liferay.Language.get('search-keyword'),
					false,
					false,
					'',
					{}
				).css({
					'width':'35%',
					'display': 'inline-block'
				}).addClass('sx-search-form-control').appendTo( $node );

			
				let $curlingSpan = $('<span style="margin: 0px 5px;max-width:4%;">~</span>')
										.hide().appendTo($node);

				let $toInputTag = FormUIUtil.$getTextInput(
					controlName+'_to',
					controlName,
					'text',
					Liferay.Language.get('search-keyword'),
					false,
					false,
					'',
					{}
				).css({
					'width': '35%',
					'display': 'inline-block'
				}).addClass('sx-search-form-control').hide().appendTo( $node );
						
				let $rangeSearch = FormUIUtil.$getCheckboxTag( 
					controlName+'_rangeSearch',
					controlName+'_rangeSearch',
					Liferay.Language.get( 'range' ),
					false,
					'rangeSearch',
					false,
					{}
				).css({'float':'right'}).appendTo( $node );

			
				$fromInputTag.off('change').on('change', function(event){
					event.stopPropagation();

					let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
					dataPacket.term = term;

					let rangeSearch = $rangeSearch.find('input').first().prop('checked');
					if( rangeSearch ){
						dataPacket.rangeSearch = rangeSearch;
						dataPacket.from = Util.toSafeNumber( $fromInputTag.val() );
						dataPacket.to = Util.toSafeNumber( $toInputTag.val() );
					}
					else{
						let keywords = $(this).val().split( Term.KEYWORD_REG_EXPR );
						dataPacket.keywords = keywords.map( keyword=>Util.toSafeNumber(keyword) )
														.filter( keyword => Util.isNotEmpty(keyword) );
					}

					Util.fire(
						Events.SEARCH_KEYWORD_CHANGED,
						dataPacket
					);
				});

				$toInputTag.off('change').on('change', function(event){
					event.stopPropagation();

					let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
					dataPacket.term = term;
					dataPacket.rangeSearch = true;
					dataPacket.from = Util.toSafeNumber($fromInputTag.val());
					dataPacket.to = Util.toSafeNumber($(this).val());
					dataPacket.$source = $(this);

					Util.fire(
						Events.SEARCH_KEYWORD_CHANGED,
						dataPacket
					);
				});

				$rangeSearch.off('change').on('change', function(event){
					let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
					dataPacket.term = term;
					dataPacket.rangeSearch = Util.toSafeBoolean( $(this).find('input').first().prop('checked') );
					
					if( dataPacket.rangeSearch === true ){
						let keywords = $fromInputTag.val().split( Term.KEYWORD_REG_EXPR );
						dataPacket.from = Util.toSafeNumber( keywords[0] );
						dataPacket.to = Util.toSafeNumber( $toInputTag.val() );
						$curlingSpan.show();
						$toInputTag.show();
					}
					else{
						let keywords = $fromInputTag.val().split( Term.KEYWORD_REG_EXPR );
						dataPacket.keywords = keywords.map( keyword=>Util.toSafeNumber(keyword) )
														.filter( keyword => Util.isNotEmpty(keyword) );
						$curlingSpan.hide();
						$toInputTag.hide();
					}

					Util.fire(Events.SEARCH_KEYWORD_CHANGED, dataPacket );
				});
				
				return $node;
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				let $table = $('<table style="margin-left:10px;">');
				for( let r=0; r < this.#rows; r++ ){
					let $tr = $('<tr style="line-height:1.8rem;">').appendTo( $table ) ;
					if( r === 0 ){
						$tr.append( $('<td><span style="font-size:1rem;">&#9121;</span></td>') );
					}
					else if( r > 0 && r < this.#rows - 1 ){
						$tr.append( $('<td><span style="font-size:1rem;">&#9122;</span></td>') );
					}
					else{
						$tr.append( $('<td><span style="font-size:1rem;">&#9123;</span></td>') );
					}
					
					for( let c=0; c<this.#columns; c++){
						let $td = $('<td>').appendTo( $tr );
						let $input = $('<input type="text" ' + 
										'name="' + NAMESPACE + this.termName+'_'+r+'_'+c+'_pdf"/>'
									).appendTo( $td );
						$input.css({
							'height': '1.5rem',
							'width': this.#columnWidth+'rem',
							'border': '1px solid #dddddd'
						});
					}
					
					if( r === 0 ){
						$tr.append( $('<td><span style="font-size:1rem;">&#9124;</span></td>') );
					}
					else if( r > 0 && r < this.rows - 1 ){
						$tr.append( $('<td><span style="font-size:1rem;">&#9125;</span></td>') );
					}
					else{
						$tr.append( $('<td><span style="font-size:1rem;">&#9126;</span></td>') );
					}
				}
				
				return $table;
			}
		}

		$render( forWhat, prefix ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			if( !Array.isArray(this.#value ) ){
				this.assignEmptyValue();
			}

			let $section = $('<div>');
			$section.append( this.$getLabelNode( forWhat, prefix ) );
			$section.append( this.$getControlNode( forWhat ) );

			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection( 
										$section,
										this.getPreviewPopupAction() ) ;
			}
			else if( forWhat === Constants.FOR_EDITOR ){
				this.$rendered = FormUIUtil.$getEditorRowSection( $section );
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				//this.$rendered = FormUIUtil.$getSearchRowSection( $matrixSection );
				return;
			}

			return this.$rendered;
		}

		parse( jsonObj ){
			let unparsed = super.parse( jsonObj );

			let self = this;
			Object.keys(unparsed).forEach( key => {
				switch( key ){
					case 'rows':
					case 'columns':
					case 'columnWidth':
					case 'value':
						self[key] = jsonObj[key];
						break;
					default:
						console.log( 'Un-recognizable attribute: ' + key );

				}
			});
		}

		clone(){
			return new MatrixTerm( this.toJSON() );
		}

		toJSON(){
			let json = super.toJSON();

			json.rows = this.rows;
			json.columns = this.columns;
			json.columnWidth = this.columnWidth;
			
			if( this.hasValue() ){
				json.value = this.value;
			}

			return json;
		}
	}
	
	/* 7. PhoneTerm */
	class PhoneTerm extends Term{
		#value;

		constructor( jsonObj ){
			super( "Phone" );

			if( jsonObj )	this.parse( jsonObj );
		}

		get value(){
			if( Util.isNonEmptyArray(this.#value) ){
				return this.#value.join('-');
			}
		}
		set value( value ){
			if( Util.isNotEmptyString(value) ){
				this.#value = value.split('-');
				return;
			}
			else if( Util.isNonEmptyArray(value) ){
				this.#value = value;
				return;
			}
			
			this.#value = undefined;
		}

		get mobileNo(){ return this.hasValue() ? this.#value[0] : undefined; }
		set mobileNo(val){ 
			if( !this.#value ){
				this.#value = new Array();
			}
			
			this.#value[0] = val;
		}
		get stationNo(){ return this.hasValue() ? this.#value[1] : undefined; }
		set stationNo(val){ 
			if( !this.#value ){
				this.#value = new Array();
			}
			
			this.#value[1] = val;
		}
		get personalNo(){ return this.hasValue() ? this.#value[2] : undefined; }
		set personalNo(val){ 
			if( !this.#value ){
				this.#value = new Array();
			}
			
			this.#value[2] = val;
		}

		checkDigit( $control, val ){

			if( !Number.isInteger( Util.toSafeNumber(val) ) ){
				$.alert('only-0-9-digit-allowed');
				$control.trigger('focus');

				return false;
			}

			return true;
		}

		hasValue(){
			if( !Util.isNonEmptyArray( this.#value ) )	return false;

			if( this.#value[0] && this.#value[1] && this.#value[2] )	return true;
			
			return false;
		}

		$getControlNode( forWhat ){
			let helpMessage = '';
			let self = this;
			if( !!this.tooltip )	helpMessage = this.getLocalizedTooltip();

			let $node;

			if( forWhat === Constants.FOR_SEARCH ){
				$node = $('<div>');

				let eventFuncs = {
					'change': function( event ){
						let keywords = $(this).val();

						if( Util.isEmpty(keywords) ){
							keywords = null;
						}
						else{
							keywords = keywords.split( Term.KEYWORD_REG_EXPR );
						}

						let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = self;
						dataPacket.keywords = keywords

						Util.fire(Events.SEARCH_KEYWORD_CHANGED, dataPacket );
					}
				};

				FormUIUtil.$getTextInput( 
								NAMESPACE + this.termName,
								NAMESPACE + this.termName,
								'text',
								'',
								false,
								false,
								'',
								eventFuncs
							).appendTo( $node );

			}
			else if( forWhat === Constants.FOR_EDITOR ||
					 forWhat === Constants.FOR_PREVIEW ){
				$node = $('<div>');

				let eventFuncs = {
					change: function(event){
						event.stopPropagation();

						let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = self;
						dataPacket.attribute = "mobileNo";
						dataPacket.value = $(this).val();
						dataPacket.$source = $(this);

						Util.fire(
							Events.TERM_VALUE_CHANGED, 
							dataPacket );
					},
					keyup: function( event ){
						let maxLength = $(this).prop('maxLength');
						let valLength = $(this).val().length;

						if( maxLength === valLength ){
							$(this).siblings('input').first().trigger('focus');
						}
					}
				};

				let $mobileInput = FormUIUtil.$getTextInput(
										NAMESPACE + this.termName + '_mobile',
										NAMESPACE + this.termName + '_mobile',
										'text',
										'',
										false,
										this.disabled,
										this.mobileNo,
										eventFuncs
									).prop( 'maxLength', '3' )
									.css({
										'width': '4rem',
										'display': 'inline-block',
										'text-align': 'center'
									}).appendTo( $node );

				$('<span>)&nbsp;</span>').appendTo( $node );

				eventFuncs = {
					change: function(event){
						event.stopPropagation();

						let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = self;
						dataPacket.attribute = "stationNo";
						dataPacket.value = $(this).val();
						dataPacket.$source = $(this);

						Util.fire(
							Events.TERM_VALUE_CHANGED, 
							dataPacket );
					},
					keyup: function( event ){
						let maxLength = $(this).prop('maxLength');
						let valLength = $(this).val().length;

						if( maxLength === valLength ){
							$(this).siblings('input').last().trigger('focus');
						}
					}
				};

				let $stationInput = FormUIUtil.$getTextInput(
										NAMESPACE + this.termName + '_station',
										NAMESPACE + this.termName + '_station',
										'text',
										'',
										false,
										this.disabled,
										this.stationNo,
										eventFuncs
									).appendTo( $node );

				$stationInput.prop( 'maxLength', '4' );
				$stationInput.css({
									'width': '5rem',
									'display': 'inline-block',
									'text-align': 'center',
									'margin-left': '3px',
									'margin-right': '5px'
								});

				$('<span>-</span>').appendTo( $node );

				eventFuncs = {
					change: function(event){
						event.stopPropagation();

						let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = self;
						dataPacket.attribute = "personalNo";
						dataPacket.value = $(this).val();
						dataPacket.$source = $(this);

						Util.fire(
							Events.TERM_VALUE_CHANGED, 
							dataPacket );						
					}
				};

				let $personalInput = FormUIUtil.$getTextInput(
										NAMESPACE + this.termName + '_personal',
										NAMESPACE + this.termName + '_personal',
										'text',
										'',
										false,
										this.disabled,
										this.personalNo,
										eventFuncs
									).appendTo( $node );

				$personalInput.prop( 'maxLength', '4' );
				$personalInput.css({
									'width': '5rem',
									'display': 'inline-block',
									'text-align': 'center',
									'margin-left': '5px'
								});

				$node.css('margin-left', '15px');								
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				$node = FormUIUtil.$getTextInput( 
								NAMESPACE + this.termName,
								NAMESPACE + this.termName,
								'text',
								'',
								this.mandatory,
								false,
								'',
								{}
							).removeClass('form-control')
							.css({
								'border': '1px solid #dddddd'
							});

			}

			$node.css({
				'width': this.cssWidth ? this.cssWidth : '100%',
				'max-width': '100%'
			});
			
			return $node;
		}
		
		$render( forWhat, prefix ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			let $section = $('<div>');

			$section.append( this.$getLabelNode( forWhat, prefix ) );
			$section.append( this.$getControlNode( forWhat ) );
			
			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection( 
													$section, 
													this.getPreviewPopupAction() ) ;
			}
			else if( forWhat === Constants.FOR_EDITOR ){
				this.$rendered = FormUIUtil.$getEditorRowSection( $section );
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				this.$rendered = FormUIUtil.$getSearchRowSection( $section );
			}

			return this.$rendered;
		}

		validate( phoneNo ){
			return /[0-9]{3}-[0-9]{4}-[0-9]{4}/.test( phoneNo );
		}

		parse( jsonObj ){
			super.parse( jsonObj );

			this.#value = jsonObj.value;
		}

		clone(){
			return new PhoneTerm( this.toJSON() );
		}

		toJSON(){
			let json = super.toJSON();

			if( this.hasValue() ){
				json.value = this.value;
			}

			return json;
		}
	}
	
	/* 8. DateTerm */
	class DateTerm extends Term{
		static DEFAULT_ENABLE_TIME = false;
		//static DEFAULT_START_YEAR = '1950';
		static DEFAULT_START_YEAR = '1950';
		static DEFAULT_END_YEAR = new Date().getFullYear();
		static DEFAULT_SIZE = '200px';
		static TIME_ENABLED_SIZE = '500px';

		static IMPOSSIBLE_DATE = -1;
		static OUT_OF_RANGE = -2;
		static SUCCESS = 1;

		#value;
		#enableTime;
		#startYear;
		#endYear;

		constructor( jsonObj ){
			super('Date');

			this.enableTime = false;
			this.startYear = DateTerm.DEFAULT_START_YEAR;
			this.endYear = DateTerm.DEFAULT_END_YEAR;

			if( jsonObj ) 	this.parse( jsonObj );
			
		}

		get value(){ return this.#value; }
		set value( value ){
			let safeValue = Util.toSafeNumber( value );

			if( isNaN(safeValue) ){
				this.#value = undefined;
			}
			else{
				this.#value = safeValue;
			}
		}
		get enableTime(){return this.#enableTime;}
		set enableTime(val){this.#enableTime=val;};
		get startYear(){return this.#startYear;}
		set startYear(val){this.#startYear=val;};
		get endYear(){return this.#endYear;}
		set endYear(val){this.#endYear=val;};

		$getEditDateNode(){
			let term = this;

			let controlName = NAMESPACE + this.termName;

			let $node = $('<div style="padding-right:15px;">');
			
			let value;
			if( this.enableTime ){
				value = this.toDateTimeString();
			}
			else{
				value = this.toDateString();
			}

			let eventFuncs = {
				change: function(event){
					let value;
					if( Util.isEmptyString( $(this).val() ) ){
						value = undefined;
					}
					else{
						value = $(this).datetimepicker("getValue").getTime();
					}

					let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
					dataPacket.term = term;
					dataPacket.attribute = TermAttributes.VALUE;
					dataPacket.value = value;
					dataPacket.$source = $(this);
					Util.fire(
						Events.TERM_VALUE_CHANGED,
						dataPacket
					);
				}
			};

			let $inputTag = FormUIUtil.$getTextInput( 
									controlName, 
									controlName,
									'text',
									'',
									!!this.mandatory,
									!!this.disabled,
									'',
									eventFuncs
								).appendTo( $node );
			
			let options = {
				lang: 'kr',
				changeYear: true,
				changeMonth : true,
				//mask: true,
				yearStart: this.startYear ? this.startYear : new Date().getFullYear(),
				yearEnd: this.endYear ? this.endYear : new Date().getFullYear(),
				scrollInput:false,
				validateOnBlur: false,
				id:controlName,
				onchangeDateTime: function( ct, $input ){
					console.log( 'onchangeDateTime: ', ct, $input );
				}
			};

			if( this.enableTime ){
				options.timepicker = true;
				options.format = 'Y/m/d H:i';
				options.step = 60,
				options.value = this.toDateTimeString(),
				$inputTag.datetimepicker(options);
			}
			else{
				options.timepicker = false;
				options.format = 'Y/m/d';
				options.value = this.toDateString(),
				$inputTag.datetimepicker(options);
			}

			$node.css({
				'width': this.cssWidth ? this.cssWidth : '100%',
				'max-width': '100%',
				'margin-left': '15px'
			});

			return $node;
		}

		$getSearchDateNode(){
			let term = this;

			let controlName = NAMESPACE + term.termName;

			let $node = $('<div>');

			let $fromInputTag = FormUIUtil.$getTextInput(
									controlName+'_from',
									controlName,
									'text',
									'',
									false,
									false,
									this.fromSearchDate,
									{}
								).css({
									display: 'inline-block',
									width: '30%'
								}).appendTo( $node );

			let $curlingSpan = $('<span style="margin: 0px 5px;max-width:4%;">~</span>')
										.hide().appendTo($node);

			let $toInputTag = FormUIUtil.$getTextInput(
									controlName+'_to',
									controlName,
									'text',
									'',
									false,
									false,
									this.toSearchDate,
									{}
								).css({
									display: 'inline-block',
									width: '30%'
								}).hide().appendTo( $node );
			
			let options = {
				lang: 'kr',
				changeYear: true,
				changeMonth : true,
				validateOnBlur: false,
				yearStart: term.startYear ? term.startYear : new Date().getFullYear(),
				yearEnd: term.endYear ? term.endYear : new Date().getFullYear(),
				timepicker: false,
				format: 'Y/m/d'
			};

			$fromInputTag.datetimepicker(options);

			options.yearStart = term.startYear;
			$toInputTag.datetimepicker(options);

			let $rangeCheckbox = FormUIUtil.$getCheckboxTag( 
				controlName+'_rangeSearch',
				controlName+'_rangeSearch',
				Liferay.Language.get( 'range' ),
				false,
				'rangeSearch',
				false,
				{}
			).css({
				display: 'inline-block'
			}).appendTo( $node );

			
			$fromInputTag.off('change').on('change', function(e){
				e.stopPropagation();

				let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
				dataPacket.term = term;

				let rangeSearch = $rangeCheckbox.find('input').first().prop('checked');
				if( rangeSearch ){
					dataPacket.rangeSearch = rangeSearch;
					dataPacket.from = $fromInputTag.datetimepicker("getValue").getTime();
					dataPacket.to = $toInputTag.datetimepicker("getValue").getTime();
				}
				else{
					dataPacket.keywords = [$fromInputTag.datetimepicker("getValue").getTime()];
				}

				Util.fire( Events.SEARCH_KEYWORD_CHANGED, dataPacket );
			});

			$toInputTag.off('change').on('change', function( e ){
				e.stopPropagation();

				let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
				dataPacket.term = term;
				dataPacket.rangeSearch = true;
				dataPacket.from = $fromInputTag.datetimepicker("getValue").getTime();
				dataPacket.to = $toInputTag.datetimepicker("getValue").getTime();

				Util.fire(
					Events.SEARCH_KEYWORD_CHANGED,
					dataPacket
				);
			});

			$rangeCheckbox.off('change').on('change', function(event){
				event.stopPropagation();

				let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
				dataPacket.term = term;
				dataPacket.rangeSearch = Util.toSafeBoolean( $(this).find('input').first().prop('checked') );
				
				if( dataPacket.rangeSearch === true ){
					dataPacket.from = $fromInputTag.datetimepicker("getValue").getTime();
					dataPacket.to = $toInputTag.datetimepicker("getValue").getTime();
					$curlingSpan.show();
					$toInputTag.show();
				}
				else{
					dataPacket.keywords =$fromInputTag.datetimepicker("getValue").getTime();
					$curlingSpan.hide();
					$toInputTag.hide();
				}

				Util.fire(Events.SEARCH_KEYWORD_CHANGED, dataPacket );
			});

			return $node;
		}

		$getFormPDFDateNode(){
			let controlName = NAMESPACE + this.termName + '_pdf';

			return FormUIUtil.$getTextInput( 
									controlName, 
									controlName,
									'text',
									'',
									!!this.mandatory,
									false,
									'',
									{}
								).removeClass('form-control')
								.css({
									'margin-left': '10px',
									'border': '1px solid #dddddd'
								});
		}

		$getControlNode( forWhat ){
			let $node;
			if( forWhat === Constants.FOR_PREVIEW ||
				forWhat === Constants.FOR_EDITOR ){
				$node = this.$getEditDateNode();
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				$node = this.$getSearchDateNode();
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				$node = this.$getFormPDFDateNode();
			}

			return $node;
		}

		$render(forWhat, prefix){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			let $section = $('<div>');

			$section.append( this.$getLabelNode( forWhat, prefix ) );
			$section.append( this.$getControlNode( forWhat ) );
			
			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered =  FormUIUtil.$getPreviewRowSection( 
												$section, 
												this.getPreviewPopupAction() ) ;
			}
			else if( forWhat === Constants.FOR_EDITOR ){
				this.$rendered = FormUIUtil.$getEditorRowSection( $section );
			}
			else if(forWhat === Constants.FOR_SEARCH){
				this.$rendered = FormUIUtil.$getSearchRowSection( $section );
			}

			return this.$rendered;
		}
		
		setDateValue( value ){
			if( Util.isSafeNumber(value) ){
				this.value = value;
			}

			if( Util.isSafeNumber(this.value) ){
				if( this.enableTime ){
					$('#'+NAMESPACE+this.termName).val( this.toDateTimeString() );
				}
				else{
					$('#'+NAMESPACE+this.termName).val( this.toDateString() );
				}
			} 
		}

		setPropertyFormValues(){
			super.setPropertyFormValues();

			this.setEnableTimeFormValue();
			this.setStartYearFormValue();
			this.setEndYearFormValue();
		}

		initPropertyValues(){
			super.initPropertyValues();

			this.$rendered = null;

			this.enableTime = DateTerm.DEFAULT_ENABLE_TIME;
			this.startYear = DateTerm.DEFAULT_START_YEAR;
			this.endYear = DateTerm.DEFAULT_END_YEAR;
		}

		toDateTimeString(value=this.value){
			if( !Util.isSafeNumber(value) ){
				return '';
			}

			let date = new Date( Number( value ) );
			let year = date.getFullYear();
			let month = (date.getMonth()+1);
			let day = date.getDate();
			let hour = date.getHours().toLocaleString(undefined, {minimumIntegerDigits:2});
			let minuite = date.getMinutes().toLocaleString(undefined, {minimumIntegerDigits:2});
			let dateAry = [year, String(month).padStart(2, '0'), String(day).padStart(2, '0')];
			let timeAry = [String(hour).padStart(2, '0'), String(minuite).padStart(2, '0')];
			return dateAry.join('/') + ' ' + timeAry.join(':');
		}

		toDateString( value=this.value){
			if( !Util.isSafeNumber(value) ){
				return '';
			}

			let date = new Date( Number( value ) );
			let dateAry = [date.getFullYear(), String(date.getMonth()+1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')];

			return dateAry.join('/');
		}

		toDate(){
			return Util.isSafeNumber(this.value) ? new Date( this.value ) : new Date();
		}

		hasValue(){
			return Util.isSafeNumber( this.#value );
		}

		parse( json ){
			let unparsed = super.parse( json );
			let unvalid = new Object();

			let self = this;
			Object.keys( unparsed ).forEach(function(key, index){
				switch( key ){
					case 'enableTime':
					case 'startYear':
					case 'endYear':
					case 'value':
						self[key] = json[key];
						break;
					default:
						if( unparsed.hasOwnProperty(key) ){
							unvalid[key] = json[key];
						}
				}
			});

			return unvalid;
		}

		clone(){
			return new DateTerm( this.toJSON() );
		}

		toJSON(){

			let json = super.toJSON();
			
			if( this.enableTime )	json.enableTime = this.enableTime;
			if( this.startYear )	json.startYear = this.startYear;
			if( this.endYear )		json.endYear = this.endYear;
			if( this.hasValue() )	json.value = this.value;

			return json;
		}
	}
	
	/* 9. FileTerm */
	class FileTerm extends Term{
		#value;

		constructor( jsonObj ){
			super( 'File' );

			if( !$.isEmptyObject(jsonObj) )	this.parse( jsonObj );
		}

		get value(){
			return this.getJsonValue();
		}

		set value( value ){
			if( Util.isNotEmptyString(value) ){
				this.#value = JSON.parse( value );
			}
			else if( !$.isEmptyObject(value) ){
				this.#value = value;
			}
			else{
				return;
			}

			let files = this.#value;
			for( let fileName in files ){
				let file = files[fileName];
				
				file.parentFolderId = Util.toSafeNumber( file.parentFolderId );
				file.fileId = Util.toSafeNumber( file.fileId );
				file.size = Util.toSafeNumber( file.size );
			}
		}


		get fileNames(){ return this.hasValue() ? Object.keys(this.#value) : new Array(); }
		get inputTag(){ return this.$rendered.find('input').first()[0]; }

		get files(){
			return this.hasValue() ? this.#value : undefined;
		}

		getFile( fileName ){
			return this.hasValue() ? this.#value[fileName] : undefined;
		}

		setFile( fileName, file ){
			if( !this.hasValue() ){
				this.#value = new Object();
			}

			this.#value[fileName] = file;
		}
		
		addFile( parentFolderId, fileId, file ){
			if( this.hasFile(file.name) ){
				$.alert('File ' + file.name + ' already exist.');
				return false;
			}
			else{
				if( !this.hasValue() ){
					this.#value = new Object();
				}

				let newFile = new Object();
				newFile.name = file.name;
				newFile.size = file.size;
				newFile.type = file.type;
				
				if( file instanceof File ){
					newFile.file = file;
				}
				else{
					newFile.parentFolderId = file.parentFolderId,
					newFile.fileId = fileId;
				}
				
				this.setFile(newFile.name, newFile);
				
				let $fileListTable = this.$rendered.find('table').first().show();
				this.$getFileListTableRow( file.parentFolderId, fileId, file.name, file.size, file.type, file.downloadURL ).appendTo($fileListTable);
			}

			let dt = new DataTransfer();
			for( let fileName in this.#value ){
				let dataFile = this.getFile( fileName );

				if( dataFile.file ){
					dt.items.add( dataFile.file );
				}
			}

			let input = this.inputTag;
			input.files = dt.files;

			return true;
		}

		hasFile( fileName ){
			if( !$.isEmptyObject(this.#value) ){
				return !!this.files[fileName];
			};

			return false;
		}

		clearFile( fileName ){
			delete this.#value[fileName];
			
			if( $.isEmptyObject(this.#value) )
			this.#value = undefined;
		}

		removeFile( fileName ){
			if( $.isEmptyObject(this.#value) ){
				return;
			}

			this.clearFile(fileName);

			console.log('after remove: ', this);

			let input = this.inputTag;
			let files = input.files;
			let dt = new DataTransfer();
			for( let i=0; i<files.length; i++ ){
				let file = files[i];
				if( file.name !== fileName ){
					dt.items.add( file );
				}
			}
			
			input.files = dt.files;
		}

		$getFileListTableRow( parentFolderId, fileId, name, size, type, downloadURL ){
			let $tr = $('<tr title="'+name+'">');
			$('<td class="file-id" style="width:10%;">').appendTo($tr).text(fileId);
			$('<td class="file-name" style="width:40%;">').appendTo($tr).text(name);
			$('<td class="file-size" style="width:10%;">').appendTo($tr).text(size);
			$('<td class="file-type" style="width:10%;">').appendTo($tr).text(type);
			let $actionTd = $('<td class="action" style="width:10%;">').appendTo($tr);
			
					
			if( downloadURL ){
				let $downloadSpan =$(
					'<span class="taglib-icon-help lfr-portal-tooltip" title="' + Liferay.Language.get('download') + '" style="margin: 0 2px;">' +
						'<a href="' + downloadURL +'">' +
							'<svg class="lexicon-icon" viewBox="0 0 20 20">' +
								'<path class="lexicon-icon-outline" d="M15.608,6.262h-2.338v0.935h2.338c0.516,0,0.934,0.418,0.934,0.935v8.879c0,0.517-0.418,0.935-0.934,0.935H4.392c-0.516,0-0.935-0.418-0.935-0.935V8.131c0-0.516,0.419-0.935,0.935-0.935h2.336V6.262H4.392c-1.032,0-1.869,0.837-1.869,1.869v8.879c0,1.031,0.837,1.869,1.869,1.869h11.216c1.031,0,1.869-0.838,1.869-1.869V8.131C17.478,7.099,16.64,6.262,15.608,6.262z M9.513,11.973c0.017,0.082,0.047,0.162,0.109,0.226c0.104,0.106,0.243,0.143,0.378,0.126c0.135,0.017,0.274-0.02,0.377-0.126c0.064-0.065,0.097-0.147,0.115-0.231l1.708-1.751c0.178-0.183,0.178-0.479,0-0.662c-0.178-0.182-0.467-0.182-0.645,0l-1.101,1.129V1.588c0-0.258-0.204-0.467-0.456-0.467c-0.252,0-0.456,0.209-0.456,0.467v9.094L8.443,9.553c-0.178-0.182-0.467-0.182-0.645,0c-0.178,0.184-0.178,0.479,0,0.662L9.513,11.973z"></path>'+
	//							'<path class="lexicon-icon-outline" d="M256 0c-141.37 0-256 114.6-256 256 0 141.37 114.629 256 256 256s256-114.63 256-256c0-141.4-114.63-256-256-256zM269.605 360.769c-4.974 4.827-10.913 7.226-17.876 7.226s-12.873-2.428-17.73-7.226c-4.857-4.827-7.285-10.708-7.285-17.613 0-6.933 2.428-12.844 7.285-17.788 4.857-4.915 10.767-7.402 17.73-7.402s12.932 2.457 17.876 7.402c4.945 4.945 7.431 10.854 7.431 17.788 0 6.905-2.457 12.786-7.431 17.613zM321.038 232.506c-5.705 8.923-13.283 16.735-22.791 23.464l-12.99 9.128c-5.5 3.979-9.714 8.455-12.668 13.37-2.955 4.945-4.447 10.649-4.447 17.145v1.901h-34.202c-0.439-2.106-0.731-4.184-0.936-6.291s-0.321-4.301-0.321-6.612c0-8.397 1.901-16.413 5.705-24.079s10.24-14.834 19.309-21.563l15.185-11.322c9.070-6.7 13.605-15.009 13.605-24.869 0-3.57-0.644-7.080-1.901-10.533s-3.219-6.495-5.851-9.128c-2.633-2.633-5.969-4.71-9.977-6.291s-8.66-2.369-13.927-2.369c-5.705 0-10.561 1.054-14.571 3.16s-7.343 4.769-9.977 8.017c-2.633 3.247-4.594 7.022-5.851 11.322s-1.901 8.66-1.901 13.049c0 4.213 0.41 7.548 1.258 10.065l-39.877-1.58c-0.644-2.311-1.054-4.652-1.258-7.080-0.205-2.399-0.321-4.769-0.321-7.080 0-8.397 1.58-16.619 4.74-24.693s7.812-15.214 13.927-21.416c6.114-6.173 13.663-11.176 22.645-14.951s19.368-5.676 31.188-5.676c12.229 0 22.996 1.785 32.3 5.355 9.274 3.57 17.087 8.25 23.435 14.014 6.319 5.764 11.089 12.434 14.248 19.982s4.74 15.331 4.74 23.289c0.058 12.581-2.809 23.347-8.514 32.27z"></path>' +
							'</svg>' +
						'</a>' +
					'</span>').appendTo( $actionTd );
			}

			let $deleteBtn = $(
				'<span class="taglib-icon-help lfr-portal-tooltip" title="' + Liferay.Language.get('delete') + '" style="margin: 0 2px;">' +
					'<span>' +
						'<svg class="lexicon-icon" viewBox="0 0 20 20">' +
							'<path class="lexicon-icon-outline" d="M7.083,8.25H5.917v7h1.167V8.25z M18.75,3h-5.834V1.25c0-0.323-0.262-0.583-0.582-0.583H7.667c-0.322,0-0.583,0.261-0.583,0.583V3H1.25C0.928,3,0.667,3.261,0.667,3.583c0,0.323,0.261,0.583,0.583,0.583h1.167v14c0,0.644,0.522,1.166,1.167,1.166h12.833c0.645,0,1.168-0.522,1.168-1.166v-14h1.166c0.322,0,0.584-0.261,0.584-0.583C19.334,3.261,19.072,3,18.75,3z M8.25,1.833h3.5V3h-3.5V1.833z M16.416,17.584c0,0.322-0.262,0.583-0.582,0.583H4.167c-0.322,0-0.583-0.261-0.583-0.583V4.167h12.833V17.584z M14.084,8.25h-1.168v7h1.168V8.25z M10.583,7.083H9.417v8.167h1.167V7.083z"></path>' +
						'</svg>' +
					'</span>' +
				'</span>').appendTo( $actionTd );

			let self = this;
			$deleteBtn.click(function(event){
				if( self.disabled ){
					return;
				}

				$tr.remove();

				//self.removeFile( parentFolderId, fileId, name );

				let dataPacket = Util.createEventDataPacket(NAMESPACE, NAMESPACE);
				dataPacket.term = self;
				dataPacket.attribute = TermAttributes.VALUE;
				dataPacket.fileName = name;
				dataPacket.fileId = self.getFile(name).fileId;
				dataPacket.cmd = Constants.Commands.DELETE_DATA_FILE;
				dataPacket.$source = $(this);

				Util.fire(
					Events.TERM_VALUE_CHANGED,
					dataPacket
				);
			});

			return $tr;
		}

		$getFileUploadNode(){
			let controlName = NAMESPACE + this.termName;
			let files = this.files;

			let $node = $('<div class="file-uploader-container" style="margin-left:15px;">');

			let $input = $( '<input type="file" class="lfr-input-text form-control" size="80" multiple>' )
							.appendTo($node);

			$input.prop({
				id: controlName,
				name: controlName,
				disabled: !!this.disabled ? true : false
			});

			let term = this;
			$input.change(function(event){
				event.stopPropagation();

				let files = $(this)[0].files;

				

				//if( fileCount > 0 ){
					let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
					dataPacket.term = term;
					dataPacket.attribute = TermAttributes.VALUE;
					dataPacket.value = files;
					dataPacket.cmd = Constants.Commands.UPLOAD_DATA_FILE;
					dataPacket.$source = $(this);
					
					Util.fire( Events.TERM_VALUE_CHANGED, dataPacket );
				//}
			});

			let $fileListTable = $('<table id="' + controlName + '_fileList" style="display:none;margin-left:10px;">')
									.appendTo($node);

			if( files ){
				for( let fileName in files ){
					let file = files[fileName];
					$fileListTable.append( this.$getFileListTableRow( file.parentFolderId, file.fileId, file.name, file.size, file.type, file.downloadURL ) );
				};

				$fileListTable.show();
			}

			$node.css({
				'width': this.cssWidth ? this.cssWidth : '100%',
				'max-width': '100%'
			});

			return $node;
		}

		$getFileSearchNode(){
			let $node = $('<div>');
			let controlId = NAMESPACE + this.termName;

			let $input = $('<input class="form-control">').prop({
				'id': controlId,
				'name': controlId,
				'placeHolder': Liferay.Language.get('search-keywords')
			}).css({
				'width': this.cssWidth ? this.cssWidth : '100%'
			}).appendTo( $node );

			let self = this;
			$input.change( function(event){
				event.stopPropagation();

				let keywords = $(this).val();

				if( Util.isEmpty(keywords) ){
					keywords = null;
				}
				else{
					keywords = keywords.split( Term.KEYWORD_REG_EXPR );
				}

				let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
				dataPacket.term = self;
				dataPacket.keywords = keywords

				Util.fire(Events.SEARCH_KEYWORD_CHANGED, dataPacket );
			});

			return $node;
		}

		$getControlNode( forWhat ){
			let controlName = NAMESPACE + this.termName;

			let $node;
			if( forWhat === Constants.FOR_PREVIEW ||
				forWhat === Constants.FOR_EDITOR ){
				$node = this.$getFileUploadNode().css({
					'width': this.cssWidth,
					'max-width': '100%'
				});
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				$node = this.$getFileSearchNode().css({
					'width': '100%'
				});
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				let controlId = NAMESPACE + this.termName + '_pdf';
	
				$node = $('<input>').prop({
					'id': controlId,
					'name': controlId
				}).css({
					'position': 'relative',
					'width': '98%',
					'margin-left': '10px',
					'margin-right': '20px',
					'border': '1px solid #dddddd'
				});
			}

			return $node;
		}

		$render( forWhat, prefix ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			let $section = $('<div style="padding-right:15px;">');
			$section.append( this.$getLabelNode( forWhat, prefix ) );
			$section.append( this.$getControlNode( forWhat ) );
			
			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection(
									$section,
									this.getPreviewPopupAction() );
			}
			else if( forWhat === Constants.FOR_EDITOR ){
				this.$rendered = FormUIUtil.$getEditorRowSection($section);
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				this.$rendered = FormUIUtil.$getSearchRowSection($section);
			}

			return this.$rendered;
		}

		refreshFile( parentFolderId, fileId, fileName, fileSize, fileType ){
			let file = this.getFile(fileName);

			file.parentFolderId = Util.toSafeNumber(parentFolderId);
			file.fileId = Util.toSafeNumber(fileId);
			file.name = fileName;
			file.size = Util.toSafeNumber(fileSize);
			file.type = fileType;

			let $row = this.$rendered.find('[title="'+fileName+'"]');

			$row.find('.file-id').first().text(fileId);
		}

		getJsonValue(){
			if( $.isEmptyObject(this.#value) ){
				return {};
			}

			let json = new Object();
			
			let files = this.#value;
			for( let fileName in files ){
				let file = files[fileName];
				json[fileName] = {
					parentFolderId: file.parentFolderId,
					fileId: file.fileId,
					name: file.name,
					size: file.size,
					type: file.type,
					status: file.status
				};
			}

			return json;
		}

		hasValue(){
			return !$.isEmptyObject( this.#value );
		}

		parse( jsonObj ){
			let unparsed = super.parse( jsonObj );
			let unvalid = new Object();
			
			let self = this;
			Object.keys( unparsed ).forEach( (key, index) => {
				switch( key ){
					case 'value':
						this.value = jsonObj.value;
						break;
					default:
						unvalid[key] = unparsed[key];
				}
			});

			return unvalid;
		}

		clone(){
			return new FileTerm( this.toJSON() );
		}

		toJSON(){
			let json = super.toJSON();
			
			if( this.hasValue() ){
				json.value = this.value; 
			}
			
			return json;
		}
	}
	
	/* 10. BooleanTerm */
	class BooleanTerm extends Term {
		static DEFAULT_DISPLAY_STYLE = ListTerm.DISPLAY_STYLE_SELECT;
		static AVAILABLE_TERMS = null;

		static OPTION_FOR_TRUE = 0;
		static OPTION_FOR_FALSE = 1;

		#displayStyle;
		#value;
		#options;
		#placeHolder;

		constructor( jsonObj ){
			super('Boolean');

			this.displayStyle = BooleanTerm.DEFAULT_DISPLAY_STYLE;

			if( jsonObj )	this.parse(jsonObj);

			if( !this.displayStyle )	this.displayStyle = BooleanTerm.DEFAULT_DISPLAY_STYLE;
			if( !this.options ){
				this.options = new Array();
				// for true
				this.options.push( new ListOption( {'en_US':'Yes'}, true, false, false, [] ) );
	
				// for false
				this.options.push( new ListOption( {'en_US':'No'}, false, false, false, [] ) );
			}
		}

		get value(){ return this.#value; }
		set value( value ){	this.#value = Util.toSafeBoolean( value ); };
		get displayStyle(){return this.#displayStyle;}
		set displayStyle(val){this.#displayStyle=val;}
		get placeHolder(){ return this.#placeHolder; }
		set placeHolder(val){ this.#placeHolder = Util.toSafeLocalizedObject(val, this.placeHolder); }
		get trueOption(){return this.#options[BooleanTerm.OPTION_FOR_TRUE];}
		get falseOption(){return this.#options[BooleanTerm.OPTION_FOR_FALSE];}
		get options(){return this.#options;}
		set options(val){this.#options=val;}
		get trueOptionLabel(){return this.trueOption.label;}
		set trueOptionLabel(val){this.trueOption.label = val;}
		get trueOptionValue(){return this.trueOption.value;}
		set trueOptionValue(val){this.trueOption.value = val;}
		get trueOptionSelected(){return this.trueOption.selected;}
		set trueOptionSelected(val){this.trueOption.selected = val;}
		get falseOptionLabel(){return this.falseOption.label;}
		set falseOptionLabel(val){this.falseOption.label = val;}
		get falseOptionValue(){return this.falseOption.value;}
		set falseOptionValue(val){this.falseOption.value = val;}
		get falseOptionSelected(){return this.falseOption.selected;}
		set falseOptionSelected(val){this.falseOption.selected = val;}

		hasSlaves(){
			let hasSlaves = false;
			if( Util.isNonEmptyArray(this.options) ){
				this.options.every( option => {
					if( option.hasSlaves() ){
						hasSlaves = true;
	
						return Constants.STOP_EVERY;
					}
	
					return Constants.CONTINUE_EVERY;
				});
			}

			return hasSlaves;
		}

		/**
		 * Gets all slave term names of the BooleanTerm
		 * @returns Array of term names
		 */
		getAllSlaveTerms(){
			let termNames = new Array();
			this.#options.forEach( option => {
				if( option.hasSlaves() ){
					termNames = termNames.concat( option.slaveTerms );
				}
			});

			return termNames;
		}

		removeSlaveTerm( termName ){
			this.#options.forEach(option=>{
				option.removeSlaveTerm( termName );
			});
		} 

		deleteAllSlaveTerms(){
			this.#options.forEach(option=>{
				option.slaveTerms = undefined;
			});
		}

		getLocalizedPlaceHolder( locale=CURRENT_LANGUAGE ){
			if( !this.placeHolder || this.placeHolder.isEmpty() ){
				return '';
			}
			else{
				return this.placeHolder.getText(locale);
			}
		}

		$getControlNode( forWhat ){
			let controlName = NAMESPACE + this.termName;

			let self = this;
			let $node;

			if( forWhat === Constants.FOR_PREVIEW ||
				forWhat === Constants.FOR_EDITOR ){
				if( this.displayStyle === ListTerm.DISPLAY_STYLE_SELECT ){
					let optionValue = this.hasValue() ? this.value : undefined;
					$node = FormUIUtil.$getSelectTag(
									controlName, 
									this.options, 
									optionValue, 
									this.getLocalizedPlaceHolder(), 
									this.disabled).css('margin-left', '15px');

					$node.change(function(event){
						event.stopPropagation();
		
						let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.term = self;
						dataPacket.attribute = TermAttributes.VALUE;
						dataPacket.value = $(this).val();
						dataPacket.$source = $(this);
						Util.fire(
							Events.TERM_VALUE_CHANGED,
							dataPacket
						);
					});
				}
				else{ // Radio fieldset. Boolean terms don't provide checkbox display style. 
					$node = FormUIUtil.$getFieldsetTag( 
						null, 
						null, 
						false, 
						this.getLocalizedTooltip() ).css('margin-left', '15px');

					this.options.forEach((option, index)=>{
						let selected = ( forWhat === Constants.FOR_SEARCH ) ? false : (this.value === option.value);
						let $option = option.$render( 
										ListTerm.DISPLAY_STYLE_RADIO, 
										controlName+'_'+(index+1), 
										controlName, 
										selected).appendTo($node);

						//$option.prop( 'checked', selected );
					});
						
					$node.change(function(event){
						event.stopPropagation();

						let $checkedRadio = $(this).find('input[type="radio"]:checked').first();
						let changedVal = $checkedRadio.length > 0 ? Util.toSafeBoolean($checkedRadio.val()) : undefined;

						let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.term = self;
						dataPacket.attribute = TermAttributes.VALUE;
						dataPacket.value = changedVal;
						dataPacket.$source = $(this);
						Util.fire(
							Events.TERM_VALUE_CHANGED,
							dataPacket
						);
					});
				}
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				$node = FormUIUtil.$getFieldsetTag( 
					null, 
					null, 
					false, 
					this.getLocalizedTooltip() );

				this.options.forEach((option, index)=>{
					let $option = option.$render( 
									ListTerm.DISPLAY_STYLE_RADIO, 
									controlName+'_'+(index+1), 
									controlName, 
									false).appendTo($node);

					let selected = ( forWhat === Constants.FOR_SEARCH ) ? false : (this.value === option.value);
					$option.prop( 'checked', selected );
				});
					
				$node.change(function(event){
					event.stopPropagation();

					let $checkedRadio = $(this).find('input[type="radio"]:checked').first();
					let changedVal = ($checkedRadio.length > 0) ? $checkedRadio.val() : undefined;

					let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
					dataPacket.term = self;
					dataPacket.keywords = [Util.toSafeBoolean( changedVal )];

					Util.fire(
						Events.SEARCH_KEYWORD_CHANGED, 
						dataPacket );
				});
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				$node = $('<div style="margin:0px 10px 10px 10px;">');

				this.options.forEach((option, index)=>{
					let $option = option.$render( 
									ListTerm.DISPLAY_STYLE_RADIO, 
									controlName+'_'+(index+1)+'_pdf', 
									controlName+'_pdf', 
									false).removeClass('form-control').appendTo($node);
				});
			}

			$node.css({
				'max-width': '100%'
			});

			return $node;
		}
		
		$render( forWhat, prefix ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			let $section = $('<div style="padding-right:15px;">');

			$section.append( this.$getLabelNode( forWhat, prefix ) );
			$section.append( this.$getControlNode( forWhat ) );
			
			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection(
									$section,
									this.getPreviewPopupAction() );
			}
			else if( forWhat === Constants.FOR_EDITOR ){
				this.$rendered = FormUIUtil.$getEditorRowSection($section);
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				this.$rendered = FormUIUtil.$getSearchRowSection($section);
			}

			return this.$rendered;
		}

		hasValue(){
			return typeof this.value === 'boolean';
		}

		clone(){
			return new BooleanTerm( this.toJSON() );
		}

		toJSON(){
			let json = super.toJSON();

			json.displayStyle = this.displayStyle;

			if( Util.isSafeLocalizedObject(this.placeHolder) ){
				json.placeHolder = this.placeHolder.localizedMap;
			}

			json.options = this.options.map(option=>option.toJSON());
			if( this.hasValue() )	json.value = this.value;

			return json;
		}

		parse( jsonObj ){
			let unparsed = super.parse( jsonObj );
			let unvalid = new Array();

			let self = this;
			Object.keys(unparsed).forEach( key => {
				switch(key){
					case 'displayStyle':
					case 'placeHolder':
					case 'value':
						self[key] = jsonObj[key];
						break;
					case 'options':
						self.options = new Array();
						jsonObj.options.forEach( option => {
							if( option.hasOwnProperty('labelMap') ){
								option.label = option.labelMap;
							}
							self.options.push( new ListOption(
								option.label,
								option.value,
								option.selected,
								option.hasOwnProperty('slaveTerms') ? 
										option.slaveTerms : option.activeTerms,
								option.disabled
							));
						});
						break;
					default:
						unvalid[key] = jsonObj[key];
						console.log('[BooleanTerm] Unvalid term attribute: '+key, jsonObj[key]);
						break;
				}
			});
		}
	}

	class GridTerm extends Term{
		static ROW_INDEX_COL_NAME = '_index_';

		static ROW_INDEX_COLUMN_BACKGROUND_COLOR = '#e7e7ed';
		static COLUMN_HEAD_BACKGROUND_COLOR = '#dcf5e7';
		static COLUMN_BACKGROUND_COLOR = '#fff';
		static HIGHLIGHT_BACKGROUND_COLOR = '#acbfb5';

		/**
		 * Gets column values from a JSON data Object.
		 * 
		 * @param {Object} gridData 
		 * @param {String} columnName 
		 * @returns
		 * 	Array of the column values
		 */
		static getColumnValues( gridData, columnName ){
			let columnData = new Array();

			let keys = Object.keys( gridData );
			keys.forEach( key => {
				let rowData = gridData[key];
				columnData.push( rowData[columnName] );
			});

			return columnData;
		}

		#columnDefs;
		#value;
		#$renderedCells;
		#selectedColumn;

		get columnDefs(){
			return this.#columnDefs;
		}
		get columnDefsJSON(){ 
			if( !this.#columnDefs )	return null;

			let json = new Object();
			for( let colName in this.#columnDefs ){
				json[colName] = this.#columnDefs[colName].toJSON();
			}

			return JSON; 
		}
		get columnDefsArray(){
			let aryColumns = new Array();

			if( !this.#columnDefs )	return aryColumns;

			for( let colName in this.#columnDefs ){
				aryColumns.push( this.#columnDefs[colName] );
			}

			return aryColumns;
		}
		set columnDefs(val){
			if( $.isEmptyObject() ){
				this.#columnDefs = undefined;
				return;
			}

			if( typeof val === 'string' ){
				try{
					this.#columnDefs = JSON.parse( val );
				}
				catch( err ){
					console.log( 'get Terms[6591] err: ', err );
					throw err;
				}
			}
			else if( typeof val === 'object' ){
				this.#columnDefs = val;
			}
		}
		get columnCount(){
			return Object.keys(this.columnDefs).length;
		}
		get columnWidth(){
			return Math.toFixed(100 / this.columnCount);
		}
		get columnNames(){
			return Object.keys(this.columnDefs);
		}
		get value(){ return this.#value; }
		get rowCount(){ return Object.keys(this.#value).length; }
		set value(val){
			if( Util.isEmpty(val) ){
				this.#value = undefined;
			}

			if( typeof val === 'string' ){
				try{
					this.#value = JSON.parse(val);
				}
				catch( err ){
					$.alert(Liferay.Language.get('not-proper-json-type-for-grid-term-value') + ': '+val);
				}
			}
			else{
				this.#value = val;
			}
		}
		get selectedColumn(){ return this.#selectedColumn; }
		set selectedColumn(val){ this.#selectedColumn = val; }
		get $renderedCells(){ return this.#$renderedCells; }
		set $renderedCells(val){ this.$renderedCells = val; }
		
		constructor( json ){
			super( TermTypes.GRID );

			if( json ){
				this.parse( json );
			}
		}

		/**
		 * Gets JQuery Object Array of a column
		 * 
		 * @param {String} colName 
		 * @returns
		 * 	Array of JQuery Objects
		*/
		$getColumnCells( colName ){
			if( !this.#$renderedCells ) return;
			
			let columnCells = new Array();
			for( let row in this.#$renderedCells){
				columnCells.push( this.#$renderedCells[row][colName] );
			}
			
			return columnCells;
		}

		/**
		 * get rendered array of jQuery objects in a row.
		 *  0 < rowIndex <= rowCount
		 * 
		 * @param {int} rowIndex 
		 * @returns
		 * 	Array of JQuery rendered objects
		 */
		$getRow( rowIndex ){
			return this.#$renderedCells ? this.#$renderedCells[rowIndex] : undefined;
		}

		/**
		 * Sets JQuery object for input control on a cell. rowIndex = 0 means
		 * table header cell.
		 * 
		 * @param {int} rowIndex 
		 * @param {String} colName 
		 * @param {JQuery} $cell 
		 */
		#$setCellInput( rowIndex, colName, $cell ){
			if( !this.#$renderedCells ){
				this.#$renderedCells = new Object();
			}

			if( !this.#$renderedCells[rowIndex] ){
				this.#$renderedCells[rowIndex] = new Object();
			}

			this.#$renderedCells[rowIndex][colName] = $cell; 
		}

		/**
		 * Adds a grid column definition.
		 * The parameter term must be not an instance of GroupTerm, GridTerm 
		 * 
		 * @param {Term} columnDef 
		 */
		addColumn( columnDef ){
			if( !this.#columnDefs ){
				this.#columnDefs = new Object();
			}

			this.assignColumnOrder(columnDef);

			this.#columnDefs[columnDef.termName] = columnDef;
			columnDef.gridTerm = this;

			return this.columnDefs;
		}

		getColumnOrder( colName ){
			if( Util.isEmpty(this.columnDefs) )	return;

			let colDef = this.getColumnDef( colName );

			return colDef.order;
		}

		#removeColumnRenders( colName ){
			if( Util.isEmpty(this.#$renderedCells) )	return;

			let renders = this.$getColumnCells( colName );
			renders.forEach( $render => $render.remove() );
		}

		#adjustColumnOrders( from, size){
			for( let colName in this.#columnDefs ){
				let colDef = this.#columnDefs[colName];
				colDef.order = (colDef.order > from) ? (colDef.order - size) : colDef.order;
			};
		}

		/**
		 * Removes the definition, render images, and values of a column from the grid.
		 * 
		 * @param {String} columnName 
		 * @returns 
		 * 		Term - removed column object
		 */
		removeColumn( colName ){
			if( !this.#columnDefs )	return;

			let removedTerm = this.#columnDefs[colName];
			delete this.#columnDefs[colName];
			this.#adjustColumnOrders(removedTerm.order, 1);

			this.#removeColumnRenders( colName );

			this.deleteColumnValues( colName );

			if( $.isEmptyObject(this.#columnDefs) ){
				this.#columnDefs = undefined;
				this.#value = undefined;
			}

			removedTerm.gridTerm = undefined;
			removedTerm.order = undefined;

			return removedTerm;
		}

		/**
		 * Assigns a order to a column definition
		 * 
		 * @param {Term} colDef 
		 */
		assignColumnOrder( colDef ){
			let aryDefs = new Array();

			if( !colDef.order ){
				colDef.order = this.columnCount + 1;
				return;
			}

			for( let colName in this.#columnDefs ){
				let def = this.#columnDefs[colName];
				aryDefs[def.order] = def.order;
			}
			
			if( !colDef.order || aryDefs[colDef.order] ){
				colDef.order = aryDefs[aryDefs.length-1] + 1;
			}
		}

		/**
		 * get column values by a column name.
		 * 
		 * @param {String} columnName 
		 * @returns
		 * 		Array of column vlaues
		 */
		getColumnValues( columnName ){
			let colVal = new Array();
			let keys = Object.keys( this.#value );

			keys.forEach( key => {
				let rowVal = this.#value[key];

				colVal.push( rowVal[columnName] );
			});

			return colVal;
		}

		/**
		 * Deletes values of a column
		 * 
		 * @param {String} columnName 
		 */
		deleteColumnValues( columnName ){
			if( Util.isEmpty(this.#value) )	return;

			for( let key in this.#value ){
				let rowVal = this.#value[key];
				delete rowVal[columnName];
			};
		}

		/**
		 * get column values by a column order
		 * 
		 * @param {int} order 
		 * @returns
		 * 		Array of column values
		 */
		getColumnValuesByOrder( order ){
			let colDef = this.getColumnDefByOrder( order );
			return this.getColumnValues( colDef.termName );
		}


		/**
		 * get a column definition.
		 * 
		 * @param {String} columnName 
		 * @returns
		 * 	Term as a column definition. 
		 */
		getColumnDef( columnName ){
			return $.isEmptyObject( this.#columnDefs ) ? undefined : this.#columnDefs[columnName];
		}

		/**
		 * gets a column definition.
		 * 
		 * @param {int} order 
		 * @returns 
		 * 	Term as a column definition.
		 */
		getColumnDefByOrder( order ){
			for( let colName in this.#columnDefs ){
				let colDef = this.#columnDefs[colName];
				if( colDef.order === order ){
					return colDef; 
				}
			}
		}

		/**
		 * Gets values by row index.
		 * 
		 * @param {int} rowIndex 
		 * @returns
		 * 		Object of (column name:value) pairs 
		 */
		getRowValues( rowIndex ){
			if( Util.isEmpty(this.#value) )	return;

			return this.#value[rowIndex];
		}

		/**
		 * Deletes a row from the grid term, both of UI and Value
		 * 
		 * @param {*} rowIndex 
		 * @returns 
		 */
		deleteRow( rowIndex ){
			if( !this.#$renderedCells ){
				return;
			}

			let rowRenders = this.#$renderedCells[rowIndex];

//			let $parent;
			for( let colName in rowRenders ){
				let $cell = rowRenders[colName];
				if( !$cell ){
					// means the cell is not rendered yet.
					continue;
				}

//				$parent = $cell.parent();
				$cell.remove();
			}

			let rowKeys = Object.keys( this.#$renderedCells );
			rowKeys.forEach( rowKey => {
				let rowOrder = Number( rowKey );
				if( rowOrder > rowIndex ){
					this.#$renderedCells[rowOrder-1] = this.#$renderedCells[rowOrder];
					delete this.#$renderedCells[rowOrder];

					let $indexCell = this.#$renderedCells[rowOrder-1][GridTerm.ROW_INDEX_COL_NAME];
					$indexCell.find('div').text(rowOrder-1);

					for( let colName in this.#$renderedCells[rowOrder-1] ){
						let $cell = this.#$renderedCells[rowOrder-1][colName];
						$cell.data('rowIndex', rowOrder-1);
					}
				}
			});
		}

		
		/**
		 * Inserts a row at rowIndex
		 * 
		 * @param {int} rowIndex 
		 * @param {Array} arrayCells 
		 * @param {boolean} copy 
		 */
		insertRow( rowIndex, arrayCells, copy=false ){
			if( !this.#$renderedCells ){
				this.#$renderedCells = new Object();
			}

			let rendersRow = this.insertRendersChamber( rowIndex );

			arrayCells.forEach( elem => {
				rendersRow[elem.colName] = elem.$cell;
			});
		}

		/**
		 * Checks if the grid has a column
		 * 
		 * @param {String} colName column name
		 * @returns 
		 * 	boolean
		 */
		hasColumn( colName ){
			return !!this.columnDefs && !!this.columnDefs[colName];
		}

		/**
		 * Checks if the grid has values
		 * 
		 * @returns 
		 */
		hasValue(){
			if( Util.isEmpty(this.#value) || this.rowCount === 0 )	return false;

			for( let index in this.#value ){
				let row = this.#value[index];
				for( let colName in row ){
					if( Util.isNotEmpty(row[colName]) ){
						return true;
					}
				}
			}

			return false;
		} 

		/**
		 * Gets grid cell value.
		 * 
		 * @param {int} rowIndex 
		 * @param {String} colName 
		 * @returns 
		 */
		getCellValue( rowIndex, colName ){
			if( !this.hasValue() )	return;

			let rowVal = this.#value[rowIndex];
			
			return  rowVal ? rowVal[colName] : undefined;
		}

		/**
		 * Sets grid cell value.
		 * 
		 * @param {int} rowIndex 
		 * @param {String} colName 
		 * @param {*} val 
		 */
		setCellValue( rowIndex, colName, val ){
			if( !this.#value ){
				this.#value = new Object();
			}

			if( !this.#value[rowIndex] ){
				this.#value[rowIndex] = new Object();
			}


			if( Util.isEmptyString(val) || val === null ){
				val = undefined;
			}
			 
			this.#value[rowIndex][colName] = val;
		}

		/**
		 * Gets value of a numeric cell.
		 * @param {int} rowIndex 
		 * @param {String} colName 
		 * @param {boolean} uncertainty 
		 * @returns 
		 * 	numeric value
		 */
		getNumericCellValue( rowIndex, colName ){
			if( !this.#value || 
				Util.isEmpty(this.#value[rowIndex]) || 
				Util.isEmpty(this.#value[rowIndex][colName]) )	return;

			let colDef = this.getColumnDef( colName );

			if( colDef.uncertainty ){
				return this.#value[rowIndex][colName].value;
			}
			else{
				return this.getCellValue( rowIndex, colName );
			}
		}

		/**
		 * Gets uncertainty value of a numeric cell.
		 * @param {int} rowIndex 
		 * @param {String} colName 
		 * @returns
		 * 	numeric uncertainty value
		 */
		getNumericCellUncertainty( rowIndex, colName ){
			let colDef = this.getColumnDef( colName );
			if( !colDef.uncertainty )	return;

			let value = this.getCellValue( rowIndex, colName );

			return Util.isEmpty(value) ? undefined : value.uncertainty;
		}

		/**
		 * Sets numeric cell value of a grid.
		 * @param {int} rowIndex 
		 * @param {string} colName 
		 * @param {numeric} val 
		 */
		setNumericCellValue( rowIndex, colName, val ){
			let colDef = this.getColumnDef( colName );

			if( Util.isEmpty(val) ){
				if( !this.#value )	return;
				if( !this.#value[rowIndex] )	return;	
				if( Util.isEmpty(this.#value[rowIndex][colName]) )	return;	
				if( colDef.uncertainty ){
					delete this.#value[rowIndex][colName].value;
				}

				if( Util.isEmpty(this.#value[rowIndex][colName].value) && 
					Util.isEmpty(this.#value[rowIndex][colName].uncertainty) ){
					delete this.#value[rowIndex][colName];
				}
				return;	
			}

			if( !this.#value ){
				this.#value = new Object();
			}
			if( !this.#value[rowIndex] ){
				this.#value[rowIndex] = new Object();
			}

			if( colDef.uncertainty ){
				let cellVal = this.getCellValue( rowIndex, colName );
				if( Util.isEmpty(cellVal) || typeof cellVal !== 'object' ){
					this.#value[rowIndex] = new Object();
					this.#value[rowIndex][colName] = new Object();
				}

				this.#value[rowIndex][colName].value = val;	
			}
			else{
				this.setCellValue( rowIndex, colName, val );
			}
		}

		/**
		 * Sets numeric cell uncertainty value of a grid.
		 * @param {int} rowIndex 
		 * @param {string} colName 
		 * @param {numeric} val 
		 */
		setNumericCellUncertainty( rowIndex, colName, val ){
			let colDef = this.getColumnDef( colName );

			if( Util.isEmpty(val) ){
				if( !this.#value )	return;
				if( !this.#value[rowIndex] )	return;	
				if( Util.isEmpty(this.#value[rowIndex][colName]) )	return;	
				if( colDef.uncertainty ){
					delete this.#value[rowIndex][colName].uncertainty;
				}

				if( Util.isEmpty(this.#value[rowIndex][colName].value) && 
					Util.isEmpty(this.#value[rowIndex][colName].uncertainty) ){
					delete this.#value[rowIndex][colName];
				}
				return;	
			}

			if( !this.#value ){
				this.#value = new Object();
			}
			if( !this.#value[rowIndex] ){
				this.#value[rowIndex] = new Object();
			}

			if( colDef.uncertainty ){
				let cellVal = this.getCellValue( rowIndex, colName );
				if( Util.isEmpty(cellVal) || typeof cellVal !== 'object' ){
					this.#value[rowIndex] = new Object();
					this.#value[rowIndex][colName] = new Object();
				}

				this.#value[rowIndex][colName].uncertainty = val;	
			}
			else{
				this.setCellValue( rowIndex, colName, val );
			}
		}

		#setControlStyle( $control, minWidth, width, maxWidth ){
			width = width ? width : '100%';
			$control.css({
				'font-size':'0.8rem',
				'font-weight': '400',
				'margin': '0',
				'padding': '0',
				'height': '2.0rem',
				'min-width': minWidth + Term.WIDTH_UNIT,
				'width': width,
				'max-width': maxWidth + Term.WIDTH_UNIT
			});
		}

		#$createStringCell( rowIndex, colDef, forWhat ){
			let $cell = $('<td style="width:fit-content;">');

			let controlName = NAMESPACE+colDef.termName;

			let gridTerm = this;
			let eventFuncs;
			let value = this.getCellValue( rowIndex, colDef.termName );
			let disabled = this.disabled || colDef.disabled;

			if( forWhat === Constants.FOR_SEARCH ){
				eventFuncs = {
					change: function(event){
						let keywords = $(this).val();
						keywords = Util.isEmpty(keywords) ? null : keywords.split( Term.KEYWORD_REG_EXPR );
						
						let dataPacket = new EventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = colDef;
						dataPacket.keywords = keywords;
						Util.fire(Events.SEARCH_KEYWORD_CHANGED, dataPacket);
					}
				};
			}
			else if( forWhat === Constants.FOR_PDF_DATA ){

			}
			else{
				eventFuncs = {
					change: function(event){
						let rowIndex = $cell.data('rowIndex');

						let dataPacket = new EventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = gridTerm;
						dataPacket.attribute = TermAttributes.VALUE;
						dataPacket.value = $(this).val();
						dataPacket.row = rowIndex;
						dataPacket.column = colDef;
						dataPacket.$source = $(this);
						Util.fire(Events.TERM_VALUE_CHANGED, dataPacket);
					}
				};
			}

			let $input = FormUIUtil.$getTextInput(
					"",
					controlName,
					'text',
					this.getLocalizedPlaceHolder(),
					false,
					disabled,
					value,
					eventFuncs )
					.css({
						'width': colDef.cssWidth
					}).appendTo($cell);

			//this.#setControlStyle( $input, 5, colDef.cssWidth, 100 );

			return $cell;
		}

		#$createNumericCell( rowIndex, colDef, forWhat ){
			let $cell = $('<td style="width:fit-content;">');

			let controlName = NAMESPACE+colDef.termName;
			let gridTerm = this;

			if( forWhat === Constants.FOR_EDITOR || forWhat === Constants.FOR_PREVIEW ){
				let value = this.getNumericCellValue( rowIndex, colDef.termName );
				let uncertaintyValue = this.getNumericCellUncertainty( rowIndex, colDef.termName );
				let valueId = NAMESPACE + colDef.termName + '_' + rowIndex;
				let uncertaintyId = NAMESPACE + colDef.termName + '_uncertainty_' + rowIndex;

				let $node = 
						$('<div style="display:flex; align-items:center;justify-content: center; width:100%; margin:0; padding:0;">').appendTo($cell);

				if( Util.isNotEmpty( colDef.minValue) ){
					$('<span style="display:inline-block;max-width:fit-content;text-align:center;width:fit-content;">' +
					colDef.minValue + '</span>').appendTo( $node );
					
					let minBoundaryText = '&lt;';
					if( colDef.minBoundary ){
						minBoundaryText = '&le;';
					}

					$('<span style="display:inline-block;max-width:fit-content;width:fit-content;text-align:center;margin:3px 3px;">' +
							minBoundaryText + '</span>').appendTo( $node );

				}

				let eventFuncs = {
					change: function(event){
						let rowIndex = $cell.data('rowIndex');
							
						let dataPacket = new EventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = gridTerm;
						dataPacket.attribute = TermAttributes.VALUE;
						dataPacket.value = $(this).val();
						dataPacket.row = rowIndex;
						dataPacket.column = colDef;
						dataPacket.$source = $(this);
						Util.fire(Events.TERM_VALUE_CHANGED, dataPacket);
					}
				};

				let $input =FormUIUtil.$getTextInput(
						valueId,
						controlName,
						'text',
						colDef.getLocalizedPlaceHolder(),
						colDef.mandatory,
						this.disabled || colDef.disabled,
						value,
						eventFuncs ).css({
							'width': colDef.cssWidth
						}).appendTo($node);

				if( colDef.uncertainty ){
					$('<div style="display:inline-block;max-width:fit-content;width:fit-content;text-align:center;margin:0 5px 0 5px;"><strong>&#xB1;</strong></div>')
						.appendTo( $node );
	
					//$inputCol = $('<div style="display:inline-block; min-width:20%;width:fit-content;">').appendTo($controlSection);
	
					eventFuncs = {
						change: function( event ){
							event.stopPropagation();
							let rowIndex = $cell.data('rowIndex');

							let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
							dataPacket.term = gridTerm;
							dataPacket.attribute = TermAttributes.UNCERTAINTY_VALUE;
							dataPacket.value = $(this).val();
							dataPacket.row = rowIndex;
							dataPacket.column = colDef;
							dataPacket.$source = $(this);
							Util.fire(Events.TERM_VALUE_CHANGED, dataPacket);					
						}
					};

					FormUIUtil.$getTextInput( 
						uncertaintyId, 
						controlName, 
						'text', 
						'', 
						false, 
						this.disabled || colDef.disabled, 
						uncertaintyValue, 
						eventFuncs ).css({
							'width': 'fit-content',
							'max-width': '3rem'
						}).appendTo($node);
				}

				if( !!colDef.unit ){
					$('<div style="display:inline-block;max-width:fit-content;width:fit-content;text-align:center;margin:1rem 10px 0 10px;">' +
						colDef.unit + '</div>').appendTo( $node );
				}
	
				if( Util.isNotEmpty(colDef.maxValue) ){
					let maxBoundaryText = colDef.maxBoundary ? '&le;' : '&lt;';
					
					$('<div style="display:inline-block;max-width:fit-content;width:fit-content;text-align:center;margin:0 3px 0 3px;"><strong>' +
						maxBoundaryText + '</strong></div>').appendTo( $node );
	
					$('<div style="display:inline-block;max-width:fit-content;width:fit-content;text-align:center;"><strong>' +
						colDef.maxValue + '</strong></div>').appendTo( $node );
				}
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				let controlName = NAMESPACE + colDef.termName;

				let label = colDef.getLocalizedDisplayName();
				let helpMessage = colDef.getLocalizedTooltip();
				let mandatory = false;
				let value = '';
	
				let $controlSection = $('<div class="form-group">');
	
				if( Util.isNotEmpty(colDef.minValue) ){
					$controlSection.append($('<span>'+colDef.minValue+'</span>'));
	
					if( !!this.minBoundary ){
						$controlSection.append($('<span style="margin-left:5px; margin-right:5px;">&le;</span>'));
					}
					else{
						$controlSection.append($('<span style="margin-left:5px; margin-right:5px;">&lt;</span>'));
					}
				}
				
				let $fromSpan = $('<span class="form-group input-text-wrapper display-inline-block" style="margin-right: 5px;max-width:28%;">')
									.appendTo($controlSection);
				let $fromInputTag = $('<input type="text">').prop({
					'class': 'form-control fromDate',
					'id': controlName+'_from',
					'name': controlName+'_from',
					'value': this.getFromSearchValue()
				}).appendTo($fromSpan);

				let $curlingSpan = $('<span style="margin: 0px 5px;max-width:4%;">~</span>')
										.appendTo($controlSection)
										.hide();
				let $toSpan = $('<span class="form-group input-text-wrapper" style="margin:0px 5px;max-width:28%;">')
										.appendTo($controlSection)
										.hide();
				let $toInputTag = $('<input type="text">').prop({
					'class': 'field form-control toDate',
					'id': controlName+'_to',
					'name': controlName+'_to',
					'value': term.toSearchValue,
					'aria-live': 'assertive',
					'aria-label': ''
				}).appendTo($toSpan);
	
				if( Util.isNotEmpty(colDef.maxValue) ){
					if( !!colDef.maxBoundary ){
						$controlSection.append($('<span style="margin-left:5px; margin-right:5px;">&le;</span>'));
					}
					else{
						$controlSection.append($('<span style="margin-left:5px; margin-right:5px;">&lt;</span>'));
					}
					
					$controlSection.append($('<span>'+colDef.maxValue+'</span>'));
					
				}
				
				if( !!colDef.unit ){
					$controlSection.append($('<span style="margin-left:5px; margin-right:5px;">'+colDef.unit+'</span>'));
				}
				
				let eventFuncs = {
					change: function(event){
						//event.stopPropagation();
						let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = colDef;
						dataPacket.rangeSearch = $(this).prop('checked');
						let fromValue = Util.toSafeNumber( $fromInputTag.val() );
						
						if( dataPacket.rangeSearch === true ){
							$curlingSpan.show();
							$toSpan.show();
							dataPacket.fromKeyword = fromValue;
							dataPacket.toKeyword = Util.toSafeNumber( $toInputTag.val() );
						}
						else{
							$curlingSpan.hide();
							$toSpan.hide();
							dataPacket.keywords = fromValue;
						}
	
						Util.fire(Events.SEARCH_KEYWORD_CHANGED, dataPacket );
					}
				}
	
				let $rangeCheckbox = FormUIUtil.$getCheckboxTag( 
												controlName+'_rangeSearch',
												controlName+'_rangeSearch',
												Liferay.Language.get( 'range-search' ),
												false,
												'rangeSearch',
												false,
												eventFuncs
											).appendTo( $controlSection );
				
				$fromInputTag.change(function(event){
					event.stopPropagation();
	
					let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
					dataPacket.term = colDef;
					dataPacket.rangeSearch = $rangeCheckbox.prop('checked');
					let fromValue = fromKeyword = Util.toSafeNumber( $fromInputTag.val() );

					if( dataPacket.rangeSearch === true ){
						dataPacket.fromKeyword = fromValue;
						dataPacket.toKeyword = Util.toSafeNumber( $toInputTag.val() );
					}
					else{
						if( $(this).val() !== '' ){
							dataPacket.keywords = Util.getTokenArray($(this).val(), ' ').map( value => Number(value) );
						}
						else{
							dataPacket.keywords = null;
						}

						if( term.setSearchValues( newValues ) === false ){
							$(this).val( Util.isNonEmptyArray(previousValue) ? previousValue.join(' ') : '' );
							term.searchValues = previousValue; 
							valueChanged = false;
						} 
					}
	
					if( valueChanged === true ){
						let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = term;
						
						Util.fire(
							Events.SEARCH_FROM_NUMERIC_CHANGED,
							dataPacket
						);
					}
				});
	
				$toInputTag.change(function(event){
					event.stopPropagation();
					event.preventDefault();
	
					if( term.setToSearchValue( Number( $(this).val() ) ) === false ){
						$(this).val( term.toSearchValue );
					}
					else{
						let dataPacket = Util.createEventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = term;
						
						Util.fire(
							Events.SEARCH_TO_NUMERIC_CHANGED,
							dataPacket
						);
					}
	
				});
	
			}

			//this.#setControlStyle( $input, 5, colDef.cssWidth, 100 );

			return $cell;
		}

		#$createListCell( rowIndex, colDef, forWhat ){
			let $cell = $('<td style="width:fit-content;">');

			let controlName = NAMESPACE+colDef.termName;
			let value = this.hasValue() ? this.getCellValue( rowIndex, colDef.termName ) : null;
			let options = !!colDef.options ? colDef.options : new Array();
			let disabled = !!colDef.disabled ? true : false;
			let placeHolder = colDef.getLocalizedPlaceHolder();


			let $select = FormUIUtil.$getMultiSelectTag(
				controlName+'_'+rowIndex,
				controlName,
				options,
				value,
				placeHolder,
				colDef.multiple,
				disabled
			).css({
				'width': colDef.cssWidth
			}).appendTo( $cell );

			//this.#setControlStyle( $select, 5, colDef.cssWidth, 100 );

			let gridTerm = this;
			$select.change(function(event){
				event.stopPropagation();
				let rowIndex = $cell.data('rowIndex');

				let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
				dataPacket.term = gridTerm;
				dataPacket.attribute = TermAttributes.VALUE;
				dataPacket.value = $(this).val();
				dataPacket.row = rowIndex;
				dataPacket.column = colDef;
				dataPacket.$source = $(this);
				Util.fire(
					Events.TERM_VALUE_CHANGED,
					dataPacket
				);
			});

			return $cell;
		}

		#$createBooleanCell( rowIndex, colDef ){
			return this.#$createListCell( rowIndex, colDef );
		}

		#$createAddressCell( rowIndex, colDef ){
			let $cell = $('<td style="width:fit-content;">');

			let controlId = NAMESPACE+colDef.termName+'_'+rowIndex;
			let controlName = NAMESPACE+colDef.termName;

			let gridTerm = this;
			let eventFuncs = {
				change: function(event){
					let rowIndex = $cell.data('rowIndex');

					let dataPacket = new EventDataPacket(NAMESPACE,NAMESPACE);
					dataPacket.term = gridTerm;
					dataPacket.attribute = TermAttributes.VALUE;
					dataPacket.value = $(this).val();
					dataPacket.row = rowIndex;
					dataPacket.column = colDef;
					dataPacket.$source = $(this);
					Util.fire(Events.TERM_VALUE_CHANGED, dataPacket);
				},
				click: function(event){
					let $input = $(this);

					new daum.Postcode({
						width: 500,
						height: 600,
						oncomplete: function(data) {
							let $dlg = $('<div><input class="form-control" name="gridDetailAddr"></div>');
							$dlg.dialog({
								title: 'Enter Detail Address',
								autoOpen: true,
								dragglable: true,
								modal: true,
								buttons:[
									{
										text: Liferay.Language.get('ok'), 
										click: function(){
											let value = '';
											value += data.zonecode + ', ';
					
											if( data.userSelectionType === 'R'){
												value += CURRENT_LANGUAGE === 'ko_KR' ? data.address : data.addressEnglish.replaceAll(',', ' ');
											}
											else{
												value += CURRENT_LANGUAGE === 'ko_KR' ? data.roadAddres : data.roadAddressEnglish.replaceAll(',', ' ');
											}
					
											value += ', ';
											
											value += $dlg.find('input').first().val();

											$input.val( value );
											$input.trigger( 'change' );
											$input.trigger('focus');

											$(this).dialog( 'destroy' );
										}
									},
									{
										text: Liferay.Language.get('cancel'),
										click: function(){
											$(this).dialog('destroy');
										}
									}
								]
							});
						}
					}).open();
				}
			};


			let $input = FormUIUtil.$getTextInput(
				controlId,
				controlName,
				'text',
				'',
				false,
				this.disabled,
				this.getCellValue( rowIndex, colDef.termName ),
				eventFuncs ).css({
					'width': colDef.cssWidth
				}).appendTo($cell);

			//this.#setControlStyle( $input, 10, colDef.cssWidth, 100 );

			return $cell;
		}

		#$createPhoneCell( rowIndex, colDef ){
			let $cell = $('<td style="width:fit-content;">');

			let controlName = NAMESPACE+colDef.termName;

			let gridTerm = this;
			let eventFuncs = {
				change: function(event){
					let rowIndex = $cell.data('rowIndex');

					let dataPacket = new EventDataPacket(NAMESPACE,NAMESPACE);
					dataPacket.term = gridTerm;
					dataPacket.attribute = TermAttributes.VALUE;
					dataPacket.value = $(this).val();
					dataPacket.row = rowIndex;
					dataPacket.column = colDef;
					dataPacket.$source = $(this);
					Util.fire(Events.TERM_VALUE_CHANGED, dataPacket);
				}
			};

			let $input =FormUIUtil.$getTextInput(
				'',
				controlName,
				'text',
				'999-9999-9999',
				false,
				this.disabled,
				this.getCellValue( rowIndex, colDef.termName ),
				eventFuncs ).css({
					'width': colDef.cssWidth
				}).appendTo($cell);

			//this.#setControlStyle( $input, 10, colDef.cssWidth, 100 );

			return $cell;
		}

		#$createEmailCell( rowIndex, colDef ){
			let $cell = $('<td style="width:fit-content;">');

			let controlName = NAMESPACE+colDef.termName;

			let gridTerm = this;
			let eventFuncs = {
				change: function(event){
					let rowIndex = $cell.data('rowIndex');
					
					let dataPacket = new EventDataPacket(NAMESPACE,NAMESPACE);
					dataPacket.term = gridTerm;
					dataPacket.attribute = TermAttributes.VALUE;
					dataPacket.value = $(this).val();
					dataPacket.row = rowIndex;
					dataPacket.column = colDef;
					dataPacket.$source = $(this);
					Util.fire(Events.TERM_VALUE_CHANGED, dataPacket);
				}
			};

			let $input =FormUIUtil.$getTextInput(
							'',
							controlName,
							'text',
							this.getLocalizedPlaceHolder(),
							false,
							this.disabled,
							this.getCellValue( rowIndex, colDef.termName ),
							eventFuncs ).css({
								'width': colDef.cssWidth
							}).appendTo($cell);

			//this.#setControlStyle( $input, 10, colDef.cssWidth, 100 );

			return $cell;
		}

		#$createDateCell( rowIndex, colDef ){
			let $cell = $('<td style="width:fit-content;">');

			let controlName = NAMESPACE+colDef.termName;

			let gridTerm = this;
			let eventFuncs = {
				change: function(event){
					if( Util.isEmptyString( $(this).val() ) ){
						let rowIndex = $cell.data('rowIndex');
						
						let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.term = gridTerm;
						dataPacket.attribute = TermAttributes.VALUE;
						dataPacket.value = undefined;
						dataPacket.row = rowIndex;
						dataPacket.column = colDef;
						dataPacket.$source = $(this);
						Util.fire(
							Events.TERM_VALUE_CHANGED,
							dataPacket
						);
					}
				}
			};
			let $input =FormUIUtil.$getTextInput(
										controlName,
										controlName,
										'text',
										'',
										false,
										this.disabled,
										this.getCellValue( rowIndex, colDef.termName ),
										eventFuncs ).css({
											'width': colDef.cssWidth
										}).appendTo($cell);

			//this.#setControlStyle( $input, 10, colDef.cssWidth, 100 );

			let options = {
					lang: 'kr',
					changeYear: true,
					changeMonth : true,
					yearStart: colDef.startYear ? colDef.startYear : new Date().getFullYear(),
					yearEnd: colDef.endYear ? colDef.endYear : new Date().getFullYear(),
					scrollInput:false,
					//setDate: new Date(Number(term.value)),
					value: colDef.enableTime ? Util.toDateTimeString(gridTerm.getCellValue(rowIndex, colDef.termName)) :
											   Util.toDateString(gridTerm.getCellValue(rowIndex, colDef.termName)),
					validateOnBlur: false,
					id:controlName,
					onChangeDateTime: function(dateText, inst){
						let rowIndex = $cell.data('rowIndex');
						let value = $input.datetimepicker("getValue").getTime();

						let dataPacket = new EventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.term = gridTerm;
						dataPacket.attribute = TermAttributes.VALUE;
						dataPacket.value = value;
						dataPacket.row = rowIndex;
						dataPacket.column = colDef;
						dataPacket.$source = $(this);
						Util.fire(
							Events.TERM_VALUE_CHANGED,
							dataPacket
						);
					}
			};

			if( colDef.enableTime ){
				options.timepicker = true;
				options.format = 'Y/m/d H:i';
			}
			else{
				options.timepicker = false;
				options.format = 'Y/m/d.';
			}
			$input.datetimepicker(options);

			return $cell;
		}

		toggleStatus( $cell, dataAttr ){
			let prevStatus = $cell.data(dataAttr);

			let status = !!prevStatus ? 0 : 1;

			$cell.data(dataAttr, status);

			return status;
		}

		$createRow( index, forWhat=Constants.FOR_EDITOR, copy=false ){
			let rowIndex = Util.isEmpty( this.#$renderedCells[index] ) ? index : index + 1;
			let $row = $('<tr style="font-size:0.8rem;fomnt-weight:400;">');

			let aryCells = new Array();

			let $indexCell = $( '<td style="width:fit-content;"><div style="width:100%;height:100%;background-color:#e7e7ed;display:flex;justify-content:center;align-items: center">'+
									rowIndex +
								'</div></td>').appendTo( $row ).css({
				'min-width':'1.5rem',
				'max-width':'3rem',
				'height':'2rem'
			}).data( 'rowIndex', rowIndex );

			let gridTerm = this;
			$indexCell.off('click').on('click', function(event){
				let clickIndex = $(this).data('rowIndex');
				let status = gridTerm.toggleStatus( $(this), 'selected');
				
				gridTerm.unselectAll( forWhat );
				
				if( status ){
					//get row columns
					let rowCells = gridTerm.$getRow( clickIndex );
					console.log('clickIndex: ' + clickIndex, rowCells );
					for( let colName in rowCells ){
						rowCells[colName].children().css('background-color', GridTerm.HIGHLIGHT_BACKGROUND_COLOR);
					};

					let menu = {
						items: {
							add: {
								name: '<span style="font-size:0.8rem;font-weight:400;">Add</span>',
								icon: '<span class="ui-icon ui-icon-plusthick"></span>'
							},
							copy: {
								name: '<span style="font-size:0.8rem;font-weight:400;">Copy</span>',
								icon: '<span class="ui-icon ui-icon-copy"></span>'
							},
							delete: {
								name: '<span style="font-size:0.8rem;font-weight:400;">Delete</span>',
								icon: '<span class="ui-icon ui-icon-trash" style="font-size:1rem;"></span>'
							}
						},
						callback: function( item ){
							switch( $(item).prop('id') ){
								case 'add':{
									gridTerm.insertValueChamber( clickIndex );
									let $newRow = gridTerm.$createRow( clickIndex, forWhat, false );
									$row.after( $newRow );
									break;
								}
								case 'copy':{
									gridTerm.insertValueChamber( clickIndex, true );
									let $newRow = gridTerm.$createRow( clickIndex, forWhat, true );
									$row.after( $newRow );
									let dataPacket = new EventDataPacket(NAMESPACE,NAMESPACE);
									dataPacket.term = gridTerm;
									dataPacket.attribute = TermAttributes.VALUE;
									Util.fire(Events.TERM_VALUE_CHANGED, dataPacket);
									break;
								}
								case 'delete':{
									gridTerm.removeValueChamber( clickIndex );
									gridTerm.deleteRow( clickIndex );
									let dataPacket = new EventDataPacket(NAMESPACE,NAMESPACE);
									dataPacket.term = gridTerm;
									dataPacket.attribute = TermAttributes.VALUE;
									Util.fire(Events.TERM_VALUE_CHANGED, dataPacket);
									break;
								}
							}
						}
					};

					menu.x = event.clientX + $(document).scrollLeft();
					menu.y = event.clientY + $(document).scrollTop()
					
					popmenu( $(this), menu );
				}
				
			});

			aryCells[0] = { 
					colName: GridTerm.ROW_INDEX_COL_NAME,
					$cell: $indexCell };

			for( let colName in this.#columnDefs ){
				let colDef = this.getColumnDef(colName);

				let elem = { colName: colName };
				switch( colDef.termType ){
					case TermTypes.STRING:{
						elem.$cell = this.#$createStringCell( rowIndex, colDef, forWhat );
						break;
					}
					case TermTypes.NUMERIC:{
						elem.$cell = this.#$createNumericCell( rowIndex, colDef, forWhat );
						break;
					}
					case TermTypes.LIST:{
						elem.$cell = this.#$createListCell( rowIndex, colDef, forWhat );
						break;
					}
					case TermTypes.BOOLEAN:{
						elem.$cell = this.#$createBooleanCell( rowIndex, colDef, forWhat );
						break;
					}
					case TermTypes.ADDRESS:{
						elem.$cell = this.#$createAddressCell( rowIndex, colDef, forWhat );
						break;
					}
					case TermTypes.PHONE:{
						elem.$cell = this.#$createPhoneCell( rowIndex, colDef, forWhat );
						break;
					}
					case TermTypes.EMAIL:{
						elem.$cell = this.#$createEmailCell( rowIndex, colDef, forWhat );
						break;
					}
					case TermTypes.DATE:{
						elem.$cell = this.#$createDateCell( rowIndex, colDef, forWhat );
						break;
					}
				}

				elem.$cell.data( 'rowIndex', rowIndex );
				elem.$cell.off('click').on('click', function(event){
					event.stopPropagation();

					gridTerm.unselectAll( forWhat );

					let dataPacket = Util.createEventDataPacket(NAMESPACE, NAMESPACE);
					dataPacket.term = gridTerm;
					dataPacket.column = colDef;
					dataPacket.status = 1;
					dataPacket.fromClick = true;
					Util.fire( Events.GRID_COLUMN_SELECTED, dataPacket );
				});
				aryCells[colDef.order] = elem;
			}

			this.insertRow( rowIndex, aryCells, copy );
			//this.#$setCellInput( rowIndex+1, colName, aryCells[colDef.order] );

			aryCells.forEach( elem => $row.append(elem.$cell) );

			return $row;
		}

		/**
		 * Increases renders row indexes which are larger than largerThan.
		 * @param {int} largerThan 
		 */
		#increaseRendersRowIndex( largerThan ){
			let increasedRows = new Object();
			for( let strRowIndex in this.#$renderedCells ){
				let rowIndex = Number( strRowIndex );
				if( rowIndex >= largerThan ){
					increasedRows[(rowIndex+1)] = this.#$renderedCells[rowIndex];
					let $indexCell = increasedRows[(rowIndex+1)][GridTerm.ROW_INDEX_COL_NAME];
					$indexCell.find('div').first().text(rowIndex + 1);

					for( let colName in increasedRows[(rowIndex+1)] ){
						let $cell = increasedRows[(rowIndex+1)][colName];
						$cell.data('rowIndex', rowIndex+1 );
					}

					delete this.#$renderedCells[rowIndex];
				}
			}

			Object.assign( this.#$renderedCells, increasedRows );
		}
		
		/**
		 * Creates room for renders at position (rowIndex + 1).
		 * If copy is true, row values at rowIndex are copied.
		 * @param {int} rowIndex 
		 * @param {boolean} copy 
		 * 
		 * @returns
		 * 	Object of the new row.
		 */
		insertRendersChamber( rowIndex ){
			if( !this.#$renderedCells ){
				this.#$renderedCells = new Object();
			}

			if( rowIndex > 0 && Util.isNotEmpty(this.#$renderedCells[rowIndex]) ){
				this.#increaseRendersRowIndex( rowIndex );
			}
			
			this.#$renderedCells[rowIndex] = new Object();
			return this.#$renderedCells[rowIndex];
		}

		
		/**
		 * Increases value row indexes which are larger than largerThan.
		 * @param {int} largerThan 
		 */
		#increaseValueRowIndex( largerThan ){
			let increasedRows = new Object();
			for( let strRowIndex in this.#value ){
				let rowIndex = Number( strRowIndex );
				if( rowIndex >= largerThan ){
					increasedRows[(rowIndex+1)] = this.#value[rowIndex];
					delete this.#value[rowIndex];
				}
			}

			Object.assign( this.#value, increasedRows );
		}

		/**
		 * Creates room for values at position (rowIndex + 1).
		 * If copy is true, row values at rowIndex are copied.
		 * @param {int} rowIndex 
		 * @param {boolean} copy 
		 * @returns
		 * 	Object of the new row.
		 */
		insertValueChamber( rowIndex, copy=false ){
			if( !this.#value ){
				this.#value = new Object();
			}

			let chamber = rowIndex;
			if( Util.isNotEmpty(this.#value[rowIndex]) ){
				chamber = rowIndex + 1;
				this.#increaseValueRowIndex( chamber );
			}

			this.#value[chamber] = copy ? Object.assign( {}, this.#value[chamber-1] ) : new Object();

			console.log( 'insertValueChamber: ', this.#value );
			return this.#value[chamber];
		}

		/**
		 * Removes a value row.
		 * @param {int} rowIndex 
		 * 
		 */
		removeValueChamber( rowIndex ){
			if( !this.#value ) return;

			delete this.#value[rowIndex];

			for( let strIndex in this.#value ){
				let index = Number( strIndex );
				if( index > rowIndex ){
					this.#value[index-1] = this.#value[index];
					delete this.#value[index];
				}
			}

			console.log('removeValueChamber: ', JSON.stringify(this.#value,null,4));
		}

		/**
		 * Displays the grid view as normal state.
		 * @param {string} forWhat 
		 */
		unselectAll( forWhat ){
			for( let rowIndex in this.#$renderedCells ){
				let row = this.#$renderedCells[rowIndex];

				for( let colName in row ){
					if( colName === GridTerm.ROW_INDEX_COL_NAME ){
						if( rowIndex > 0 ){
							row[colName].css('background-color', GridTerm.ROW_INDEX_COLUMN_BACKGROUND_COLOR);
							row[colName].children().css('background-color', GridTerm.ROW_INDEX_COLUMN_BACKGROUND_COLOR);
							row[colName].data('selected', 0);
						}
					}
					else{
						if( Number(rowIndex) === 0 ){
							if( forWhat === Constants.FOR_PREVIEW ){
								row[colName].children('.ui-icon').remove();
							}
							
							row[colName].css('background-color', GridTerm.COLUMN_HEAD_BACKGROUND_COLOR);
							row[colName].children().css('background-color', GridTerm.COLUMN_HEAD_BACKGROUND_COLOR);
							row[colName].data('selected', 0);
						}
						else{
							row[colName].css('background-color', GridTerm.COLUMN_BACKGROUND_COLOR);
							row[colName].children().css('background-color', GridTerm.COLUMN_BACKGROUND_COLOR);
						}
					}
				}
			}
		}

		/**
		 * Replaces term name as column definition.
		 * @param {*} prevColName 
		 * @param {*} colName 
		 */
		replaceColumnName( prevColName, colName ){
			let colDef = this.getColumnDef( prevColName );
			colDef.termName = colName;

			delete this.#columnDefs[prevColName];
			this.#columnDefs[colName] = colDef;
		}

		/**
		 * Moves renders of a column left.
		 * @param {string} colName 
		 */
		moveColumnLeft( colName ){
			let colDef = this.getColumnDef( colName );

			if( colDef.order === 1 )	return;

			let $columnCells = this.$getColumnCells( colName );

			let prevColDef = this.getColumnDefByOrder( colDef.order - 1 );

			colDef.order--;
			prevColDef.order++;
			
			let $prevColumnCells = this.$getColumnCells( prevColDef.termName );
			$columnCells.forEach( ($cell, index) => {
				let $prevCol = $prevColumnCells[index];
				$prevCol.before( $cell );
			});
		}

		/**
		 * Moves renders of a column right.
		 * @param {string} colName 
		 * @returns 
		 */
		moveColumnRight( colName ){
			let colDef = this.getColumnDef( colName );

			if( colDef.order === this.columnCount )	return;

			let $columnCells = this.$getColumnCells( colName );

			let nextColDef = this.getColumnDefByOrder( colDef.order + 1 );

			colDef.order++;
			nextColDef.order--;
			
			let $nextColumnCells = this.$getColumnCells( nextColDef.termName );
			$columnCells.forEach( ($cell, index) => {
				let $nextCol = $nextColumnCells[index];
				$nextCol.after( $cell );
			});
		}

		/**
		 * Sets a column selected.
		 * @param {string} colName 
		 * @param {boolean} on 
		 * @param {string} forWhat 
		 */
		setColumnSelected( colName, on=true, forWhat ){
			this.unselectAll( forWhat );

			let gridTerm = this;
			if( on ){
				let $columnCells = this.$getColumnCells( colName );

				$columnCells.forEach( ($cell, index) => {
					if( index === 0 ){
						if( forWhat === Constants.FOR_PREVIEW ){
							let $leftArrow = $('<span class="ui-icon ui-icon-caret-1-w">');
							$leftArrow.off('click').on('click', function(event){
								event.stopPropagation();
								
								gridTerm.moveColumnLeft( colName );
							});
							
							$cell.prepend($leftArrow);

							let $rightArrow = $('<span class="ui-icon ui-icon-caret-1-e">');
							$rightArrow.off('click').on('click', function(event){
								event.stopPropagation();

								gridTerm.moveColumnRight( colName );
							});

							$cell.append($rightArrow);
						}

						$cell.data('selected', 1);
					}

					$cell.css( 'background-color', GridTerm.HIGHLIGHT_BACKGROUND_COLOR );
					$cell.children().css( 'background-color', GridTerm.HIGHLIGHT_BACKGROUND_COLOR );

				});
			}
		}
 
		/**
		 * Creates header cells of the grid.
		 * @param {string} forWhat 
		 * @returns 
		 */
		#$createGridHeader( forWhat ){
			let $theader = $('<tr style="font-size:0.8rem;font-weight:600;">');

			if( !this.#$renderedCells ){
				this.#$renderedCells = new Object();
			}

			let headerCells = new Array();

			let $indexColTd = $('<td style="width:fit-content;"><div style="min-width:1.0rem;width:1.5rem;max-width:2.0rem;"></div></td>');
			headerCells[0] = {
				'colName': GridTerm.ROW_INDEX_COL_NAME,
				'$cell': $indexColTd
			};

			//this.#$setCellInput( 0, GridTerm.ROW_INDEX_COL_NAME, $indexColTd );
			
			$('<div style="width:100%;">').appendTo($indexColTd);

			let gridTerm = this;
			for( let colName in this.#columnDefs){
				let colDef = this.#columnDefs[colName];
				
				let $td = $('<td class="sx-grid-th" style="width:fit-content;"></td>');
				$('<span>')
					.css({
						'width': colDef.cssWidth,
					}).text(colDef.getLocalizedDisplayName()).appendTo($td);

				$td.off('click').on('click', function(event){
					
					let status = gridTerm.toggleStatus($(this), 'selected');

					$(this).data('selected', status);

					if( forWhat === Constants.FOR_PREVIEW ){
						event.stopPropagation();

						let dataPacket = new EventDataPacket(NAMESPACE,NAMESPACE);
						dataPacket.term = gridTerm;
						dataPacket.column = colDef;
						dataPacket.status = status;
						dataPacket.fromClick = true;
						Util.fire( Events.GRID_COLUMN_SELECTED, dataPacket );
					}

					gridTerm.setColumnSelected( colName, status, forWhat );

				});

				$td.data( 'selected', 0 );
				headerCells[colDef.order] = {
					'colName': colDef.termName,
					'$cell': $td
				};

				//this.#$setCellInput( 0, colName, $td );
			};

			headerCells.forEach( elem => $theader.append(elem.$cell) );

			this.insertRow( 0, headerCells, false);

			return $theader;
		}

		$getControlNode( forWhat ){
			let $gridBody = (forWhat === Constants.FOR_PDF_FORM) ?
						$('<div style="margin-left:15px;padding-right:20px;overflow-x:auto;width:100%;max-width:100%;">') :
						$('<div style="margin-left:15px;padding-right:20px;box-shadow: 2px 2px #d5dbe3;overflow-x:auto;width:fit-content;max-width:100%;resize:block;overflow-y:visible;">');
			let $table = $('<table style="border:1px solid #d5dbe3;border-collapse: collapse;width:100%;margin-right:10px;">').appendTo( $gridBody );

			if( forWhat === Constants.FOR_EDITOR || forWhat === Constants.FOR_PREVIEW ){
				//Rendering Header
				let $theader = this.#$createGridHeader( forWhat ).appendTo($table);

				let rowCount = this.hasValue() ? this.rowCount : 0;
				for( let i=1; i<=(rowCount+1); i++ ){
					let $row = this.$createRow( i, forWhat, false ).appendTo($table);
				}
			}
			else if( forWhat === Constants.FOR_SEARCH ){

				for( let colName in this.#columnDefs ){
					let colDef = this.#columnDefs[colName];
	
					let $row = $('<tr>').appendTo( $table );
					let $labelCell = $('<td stype="padding-left:10px">').appendTo( $row );
					$labelCell.append( colDef.$getLabelNode( forWhat ) );
					let $keywordCell = $('<td>').appendTo( $row );
	
					$keywordCell.append( colDef.$getControlNode( forWhat ) );
				}

				$table.find('tr:nth-child(even)').css({
					'background-color': '#ededed'
				});
				$table.find('tr:nth-child(odd)').css({
					'background-color': '#e2e2e2'
				});
			}
			else if( forWhat === Constants.FOR_PDF_FORM ){
				for( let colName in this.#columnDefs ){
					let colDef = this.#columnDefs[colName];
	
					let $row = $('<tr style="border:1px solid #d5dbe3;border-collapse: collapse;">').appendTo( $table );
					let $labelCell = $('<td style="border:1px solid #d5dbe3;border-collapse: collapse;padding-left:10px">').appendTo( $row );
					$labelCell.append( colDef.$getLabelNode( forWhat ) );
					let $keywordCell = $('<td style="border:1px solid #d5dbe3;border-collapse: collapse;">').appendTo( $row );
	
					if( colDef.termType === TermTypes.LIST ||
						colDef.termType === TermTypes.BOOLEAN ||
						( colDef.TermTypes === TermTypes.NUMERIC &&
						  ( !Util.isEmpty(colDef.minValue) ||
						    !Util.isEmpty(colDef.maxValue ) ||
							!Util.isEmpty(colDef.unit) )
						)
					){
						$keywordCell.append( colDef.$getControlNode( forWhat ).css({
							'margin': 0,
							'padding': '3px 5px'
						}) );
					}
					else{
						$keywordCell.append( $('<div style="height:2rem;">') );
					}
				}
			}

			return $gridBody;
		}

		emptyRenders(){
			for( let cellIndex in this.#$renderedCells ){
				let row = this.#$renderedCells[cellIndex];
				for( let cellName in row ){
					row[cellName].remove();
				}
			}

			this.emptyRender();
			this.#$renderedCells = new Object();
		}

		$render( forWhat, prefix ){
			if( this.isRendered() ){
				this.emptyRenders();
			}

			let	$grid = $('<div class="sx-grid">');
			
			$grid.append( this.$getLabelNode( forWhat, prefix ) );

			$grid.append( this.$getControlNode( forWhat ) );
			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection(
									$grid,
									this.getPreviewPopupAction() );
			}
			else if( forWhat === Constants.FOR_EDITOR ){
				this.$rendered = FormUIUtil.$getEditorRowSection($grid);
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				this.$rendered = FormUIUtil.$getSearchRowSection($grid);
			}

			return this.$rendered
		}

		getLocalizedPlaceHolder( locale=CURRENT_LANGUAGE){
			if( !this.placeHolder || this.placeHolder.isEmpty() ){
				return '';
			}
			else{
				return this.placeHolder.getText(locale);
			}
		}

		multiSelectize(){
			for( let colName in this.#columnDefs ){
				let colDef = this.#columnDefs[colName];
				if( colDef.termType === TermTypes.LIST && colDef.multiple ){
					let $cells = this.$getColumnCells( colDef.termName );
					$cells.forEach( $cell => {
						$cell.find('select[multiple]').multiSelect({
							noneText: colDef.getLocalizedPlaceHolder()
						});
					});
				}
			}
		}

		displayInputStatus( inputStatus ){
			return super.displayInputStatus( inputStatus );
		}

		clone(){
			return new GridTerm( this.toJSON() );
		}

		parse( json ){
			super.parse( json );

			if( json.columnDefs ){
				for( let colName in json.columnDefs ){
					let jsonTerm = json.columnDefs[colName];
					
					let term;

					switch( jsonTerm.termType ){
						case TermTypes.STRING:{
							term = new StringTerm( jsonTerm );
							break;
						}
						case TermTypes.NUMERIC:{
							term = new NumericTerm( jsonTerm );
							break;
						}
						case TermTypes.LIST:{
							term = new ListTerm( jsonTerm );
							break;
						}
						case TermTypes.BOOLEAN:{
							term = new BooleanTerm( jsonTerm );
							break;
						}
						case TermTypes.ADDRESS:{
							term = new AddressTerm( jsonTerm );
							break;
						}
						case TermTypes.PHONE:{
							term = new PhoneTerm( jsonTerm );
							break;
						}
						case TermTypes.EMAIL:{
							term = new EMailTerm( jsonTerm );
							break;
						}
						case TermTypes.DATE:{
							term = new DateTerm( jsonTerm );
							break;
						}

					}
					this.addColumn( term );
				}

				let colAry = [0];
				for( let colName in this.#columnDefs){
					let order = this.#columnDefs[colName].order;
					colAry[order] = this.#columnDefs[colName];
				}

				for( let i=1; i< colAry.length; i++){
					if( Util.isEmpty(colAry[i]) ){
						for( let colName in this.#columnDefs ){
							let def = this.#columnDefs[colName];
							if( i < def.order ){
								def.order--;
							}
						}
					}
				};
			}

			this.value = json.value;
		}

		toJSON(){
			let json = super.toJSON();

			if( this.hasValue() ){
				console.log( 'value: ', this.value);
				json.value = this.value;
			}

			json.columnDefs = new Object();
			let columnDefs = this.#columnDefs;
			for( let columnName in columnDefs ){
				json.columnDefs[columnName] = columnDefs[columnName].toJSON();
			}

			return json;
		}
	}

	/* 11. IntergerTerm */
	class IntegerTerm extends NumericTerm{
		constructor(){
			super();
		}
	}

	/* 12. GroupTerm */
	class GroupTerm extends Term{
		static ActiveNonFullColor = '#ef6f6f';
		static ActiveFullColor = '#dfdfdf';
		static InactiveFullColor = '#555555';
		static InactiveNonFullColor = '#ef6f6f';

		#expanded;
		#inputFull;
		#tempMembers;

		get expanded(){return this.#expanded;}
		set expanded(val){this.#expanded = Util.toSafeBoolean(val);}
		get inputFull(){return this.#inputFull;}
		set inputFull(val){ this.#inputFull = val; }
		get tempMembers(){return this.#tempMembers;}
		get panelId(){
			return NAMESPACE + this.termName+ '_'+ this.termVersion + '_GroupPanel';
		}


		get $groupPanel(){
			return this.$accordion.find('.ui-accordion-content').first();
		}
		get $accordion(){ return this.$rendered.find('.ui-accordion').first(); }
		get $header(){ return this.$accordion.find('h3').first(); }


		constructor( jsonObj ){
			super('Group');

			this.expanded = false;

			if( jsonObj ){
				this.parse(jsonObj);
			}

			this.#tempMembers = new Array();

			this.#inputFull = true;
		}

		expand( expand ){
			expand ? this.$accordion.accordion('option', 'active', 0) : 
						this.$accordion.accordion('option', 'active', false);
		}

		$getControlNode( prefix ){
			let displayName = prefix ? prefix + this.getLocalizedDisplayName() : this.getLocalizedDisplayName();
			let $accordion = FormUIUtil.$getAccordionForGroup( 
				displayName,
				false,
				this.expanded );

			return $accordion;
		}

		$render( forWhat, prefix ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			let $accordion = this.$getControlNode( prefix );
			
			if( forWhat === Constants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection(
												$accordion,
												this.getPreviewPopupAction() );
			}
			else if( forWhat === Constants.FOR_EDITOR ){
				this.$rendered =  FormUIUtil.$getEditorRowSection($accordion);
			}
			else if( forWhat === Constants.FOR_SEARCH ){
				this.$rendered =  FormUIUtil.$getSearchRowSection($accordion);
			}

			this.$rendered.css({
				'width': '100%',
				'max-width': '100%'
			});

			return this.$rendered;
		}

		hasValue(){
			return false;
		}

		disable( disable ){
			this.disabled = disable;
		}

		clearHighlightedChildren(){
			this.$groupPanel.find('.sx-form-item-group.highlight').removeClass('highlight');
		}

		parse( jsonObj ){
			let unparsed = super.parse( jsonObj );

			let self = this;
			for( let key in unparsed ){
				switch( key ){
					case 'extended':
						self.expanded = jsonObj.extended;
						break;
					case 'expanded':
						self[key] = jsonObj.expanded;
						//FormUIUtil.setFormCheckboxValue( 'expanded', self[key] );
						break;
					case 'value':
					case 'dirty':
						break;
					default:
						console.log('Group Term has unparsed attributes: '+ self.termName, key, unparsed[key]);
				}
			}
		}

		clone(){
			return new GroupTerm( this.toJSON() );
		}

		toJSON(){
			let json = super.toJSON();

			if( this.expanded ){
				json.expanded = this.expanded;
			}

			return json;
		}
	}

	class TermPropertiesForm{
		#termType;
		#termName;
		#termVersion;
		#termDisplayName;
		#termDefinition;
		#termTooltip;
		#synonyms;
		#mandatory;
		#value;
		#abstractKey;
		#searchable;
		#downloadable;
		#disabled;
		#placeHolder;
		#numericPlaceHolder
		#minLength;
		#maxLength;
		#multipleLine;
		#validationRule;
		#minValue;
		#maxValue;
		#minBoundary;
		#maxBoundary;
		#unit;
		#uncertainty;
		#sweepable;
		#listOptions;
		#displayStyle;
		#multiple;
		#optionLabel;
		#optionValue;
		#optionSelected;
		#optionSlaveTerms;
		#booleanDisplayStyle;
		#trueLabel;
		#falseLabel;
		#enableTime;
		#startYear;
		#endYear;
		#allowedExtensions;
		#expanded;
		#rows;
		#columns;
		#columnWidth;
		#cssWidth;
		#cssCustom;

		#currentOption;

		addOption(option){
			this.#listOptions.push(option);
			this.currentOption = option;

			this.$renderListOption( this.currentOption );
			this.highlightOptionPreview( this.currentOption.$defined );
		}

		deleteOption(option){
			this.#listOptions = this.#listOptions.filter( opt => opt !== option );
			option.$defined.remove();

			if( this.#listOptions.length > 0 ){
				this.currentOption = this.#listOptions[0];
				this.$btnAddOption = true;
				this.highlightOptionPreview(this.currentOption.$defined);
			}
			else{
				this.currentOption = new ListOption();
				this.$btnAddOption = false;
			}
		}

		constructor(){
			let self = this;

			let dataPacket = new EventDataPacket(NAMESPACE,NAMESPACE);
			this.$termType.off('change').on('change',function(event){
				dataPacket.value = self.termType;
				dataPacket.attributeName = TermAttributes.TERM_TYPE;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$termName.off('change').on('change',function(event){
				dataPacket.value = self.termName;
				dataPacket.attributeName = TermAttributes.TERM_NAME;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$termVersion.off('change').on('change',function(event){
				dataPacket.value = self.termVersion;
				dataPacket.attributeName = TermAttributes.TERM_VERSION;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$termDisplayName.off('change').on('change',function(event){
				dataPacket.value = self.termDisplayName;
				dataPacket.attributeName = TermAttributes.DISPLAY_NAME;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$termDefinition.off('change').on('change',function(event){
				dataPacket.value = self.termDefinition;
				dataPacket.attributeName = TermAttributes.DEFINITION;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$abstractKey.off('change').on('change',function(event){
				dataPacket.value = self.abstractKey;
				dataPacket.attributeName = TermAttributes.ABSTRACT_KEY;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$disabled.off('change').on('change',function(event){
				dataPacket.value = self.disabled;
				dataPacket.attributeName = TermAttributes.DISABLED;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$searchable.off('change').on('change',function(event){
				dataPacket.value = self.searchable;
				dataPacket.attributeName = TermAttributes.SEARCHABLE;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$downloadable.off('change').on('change',function(event){
				dataPacket.value = self.downloadable;
				dataPacket.attributeName = TermAttributes.DOWNLOADABLE;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$termTooltip.off('change').on('change',function(event){
				dataPacket.value = self.termTooltip;
				dataPacket.attributeName = TermAttributes.TOOLTIP;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$synonyms.off('change').on('change',function(event){
				dataPacket.value = self.synonyms;
				dataPacket.attributeName = TermAttributes.SYNONYMS;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$mandatory.off('change').on('change',function(event){
				dataPacket.value = self.mandatory;
				dataPacket.attributeName = TermAttributes.MANDATORY;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$value.off('change').on('change',function(event){
				dataPacket.value = self.value;
				dataPacket.attributeName = TermAttributes.VALUE;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$cssWidth.off('change').on('change',function(event){
				dataPacket.value = self.cssWidth;
				dataPacket.attributeName = TermAttributes.CSS_WIDTH;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});

			this.$cssCustom.off('change').on('change',function(event){
				dataPacket.value = self.cssCustom;
				dataPacket.attributeName = TermAttributes.CSS_CUSTOM;
				Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
			});
		}

		get termType(){ return FormUIUtil.getFormValue('termType'); }
		set termType(val){ FormUIUtil.setFormValue('termType', val); }
		get termName(){ return FormUIUtil.getFormValue('termName'); }
		set termName(val){ FormUIUtil.setFormValue('termName', val); }
		get termVersion(){ return FormUIUtil.getFormValue('termVersion'); }
		set termVersion(val){ FormUIUtil.setFormValue('termVersion', val); }
		get termDisplayName(){ return FormUIUtil.getFormLocalizedValue('termDisplayName'); }
		set termDisplayName(val){ FormUIUtil.setFormLocalizedValue('termDisplayName', val); }
		get termDefinition(){ return FormUIUtil.getFormLocalizedValue('termDefinition'); }
		set termDefinition(val){ FormUIUtil.setFormLocalizedValue('termDefinition', val); }
		get abstractKey(){ return FormUIUtil.getFormCheckboxValue('abstractKey'); }
		set abstractKey(val){ FormUIUtil.setFormCheckboxValue('abstractKey', val); }
		get disabled(){ return FormUIUtil.getFormCheckboxValue('disabled'); }
		set disabled(val){ FormUIUtil.setFormCheckboxValue('disabled', val); }
		get searchable(){ return FormUIUtil.getFormCheckboxValue('searchable'); }
		set searchable(val){ FormUIUtil.setFormCheckboxValue('searchable', val); }
		get downloadable(){ return FormUIUtil.getFormCheckboxValue('downloadable'); }
		set downloadable(val){ FormUIUtil.setFormCheckboxValue('downloadable', val); }
		get termTooltip(){ return FormUIUtil.getFormLocalizedValue('termTooltip'); }
		set termTooltip(val){ FormUIUtil.setFormLocalizedValue('termTooltip', val); }
		get synonyms(){ return FormUIUtil.getFormValue('synonyms'); }
		set synonyms(val){ FormUIUtil.setFormValue('synonyms', val); }
		get mandatory(){ return FormUIUtil.getFormCheckboxValue('mandatory'); }
		set mandatory(val){ FormUIUtil.setFormCheckboxValue('mandatory', val); }
		get value(){ return FormUIUtil.getFormValue('value'); }
		set value(val){ FormUIUtil.setFormValue('value', val); }
		get placeHolder(){ return FormUIUtil.getFormLocalizedValue('placeHolder'); }
		set placeHolder(val){ FormUIUtil.setFormLocalizedValue('placeHolder', val); }
		get minLength(){ return FormUIUtil.getFormValue('minLength'); }
		set minLength(val){ FormUIUtil.setFormValue('minLength', val); }
		get maxLength(){ return FormUIUtil.getFormValue('maxLength'); }
		set maxLength(val){ FormUIUtil.setFormValue('maxLength', val); }
		get multipleLine(){ return FormUIUtil.getFormCheckboxValue('multipleLine'); }
		set multipleLine(val){ FormUIUtil.setFormCheckboxValue('multipleLine', val); }
		get validationRule(){ return FormUIUtil.getFormValue('validationRule'); }
		set validationRule(val){ FormUIUtil.setFormValue('validationRule', val); }
		get inputSize(){ return FormUIUtil.getFormValue('inputSize'); }
		set inputSize(val){ FormUIUtil.setFormValue('inputSize', val); }
		get lineBreak(){ return FormUIUtil.getFormValue('lineBreak'); }
		set lineBreak(val){ FormUIUtil.setFormValue('lineBreak', val); }
		get minValue(){ return FormUIUtil.getFormValue('minValue'); }
		set minValue(val){ 
				FormUIUtil.setFormValue('minValue', val);
				this.$minBoundary = isNaN(val) ? true : false;
			}
		get maxValue(){ return FormUIUtil.getFormValue('maxValue'); }
		set maxValue(val){ 
				FormUIUtil.setFormValue('maxValue', val);
				this.$maxBoundary = isNaN(val) ? true : false;
			}
		get minBoundary(){ return FormUIUtil.getFormCheckboxValue('minBoundary'); }
		set minBoundary(val){ FormUIUtil.setFormCheckboxValue('minBoundary', val); }
		get maxBoundary(){ return FormUIUtil.getFormCheckboxValue('maxBoundary'); }
		set maxBoundary(val){ FormUIUtil.setFormCheckboxValue('maxBoundary', val); }
		get unit(){ return FormUIUtil.getFormValue('unit'); }
		set unit(val){ FormUIUtil.setFormValue('unit', val); }
		get uncertainty(){ return FormUIUtil.getFormCheckboxValue('uncertainty'); }
		set uncertainty(val){ FormUIUtil.setFormCheckboxValue('uncertainty', val); }
		get sweepable(){ return FormUIUtil.getFormCheckboxValue('sweepable'); }
		set sweepable(val){ FormUIUtil.setFormCheckboxValue('sweepable', val); }
		get displayStyle(){ return FormUIUtil.getFormRadioValue('displayStyle'); }
		set displayStyle(val){ FormUIUtil.setFormRadioValue('displayStyle', val); }
		get multiple(){ return FormUIUtil.getFormCheckboxValue('multiple'); }
		set multiple(val){ FormUIUtil.setFormCheckboxValue('multiple', val); }
		get optionLabel(){ return FormUIUtil.getFormLocalizedValue('optionLabel'); }
		set optionLabel(val){ FormUIUtil.setFormLocalizedValue('optionLabel', val); }
		get optionValue(){ return FormUIUtil.getFormValue('optionValue'); }
		set optionValue(val){ FormUIUtil.setFormValue('optionValue', val); }
		get optionSelected(){ return FormUIUtil.getFormCheckboxValue('optionSelected'); }
		set optionSelected(val){ FormUIUtil.setFormCheckboxValue('optionSelected', val); }
		get trueLabel(){ return FormUIUtil.getFormLocalizedValue('trueLabel'); }
		set trueLabel(val){ FormUIUtil.setFormLocalizedValue('trueLabel', val); }
		get falseLabel(){ return FormUIUtil.getFormLocalizedValue('falseLabel'); }
		set falseLabel(val){ FormUIUtil.setFormLocalizedValue('falseLabel', val); }
		get enableTime(){ return FormUIUtil.getFormCheckboxValue('enableTime'); }
		set enableTime(val){ FormUIUtil.setFormCheckboxValue('enableTime', val); }
		get startYear(){ return FormUIUtil.getFormValue('startYear'); }
		set startYear(val){ FormUIUtil.setFormValue('startYear', val); }
		get endYear(){ return FormUIUtil.getFormValue('endYear'); }
		set endYear(val){ FormUIUtil.setFormValue('endYear', val); }
		get allowedExtensions(){ return FormUIUtil.getFormValue('allowedExtensions'); }
		set allowedExtensions(val){ FormUIUtil.setFormValue('allowedExtensions', val); }
		get expanded(){ return FormUIUtil.getFormCheckboxValue('expanded'); }
		set expanded(val){ FormUIUtil.setFormCheckboxValue('expanded', val); }
		get rows(){ return FormUIUtil.getFormValue('rows'); }
		set rows(val){ FormUIUtil.setFormValue('rows', val); }
		get columns(){ return FormUIUtil.getFormValue('columns'); }
		set columns(val){ FormUIUtil.setFormValue('columns', val); }
		get columnWidth(){ return FormUIUtil.getFormValue('columnWidth'); }
		set columnWidth(val){ FormUIUtil.setFormValue('columnWidth', val); }
		get cssWidth(){ return FormUIUtil.getFormValue('cssWidth'); }
		set cssWidth(val){ FormUIUtil.setFormValue('cssWidth', val); }
		get cssCustom(){ return FormUIUtil.getFormValue('cssCustom'); }
		set cssCustom(val){ FormUIUtil.setFormValue('cssCustom', val); }

		get currentOption(){ return this.#currentOption; }
		set currentOption(val){
				this.#currentOption = !val ? new ListOption() : val;
				this.setOptionForm();

				if( this.#currentOption.$defined ){
					this.highlightOptionPreview( this.#currentOption.$defined );
				}
				else{
					this.clearOptionPreviewHighlight();
				}
		}
		get listOptions(){ return this.#listOptions; }
		set listOptions(val){ 
				if( !(val instanceof Array) ){
					this.listOptions = new Array();
					return;
				}

				this.#listOptions = val; 
				let self = this;
				this.$optionsBody.empty();
				this.#listOptions.forEach( option => self.$renderListOption(option) );

				if( this.listOptions.length > 0 ){
					this.currentOption = this.listOptions[0];
				}
				else{
					this.currentOption = new ListOption();
				}
		}

		get $termType(){ return $('#'+NAMESPACE+'termType'); }
		set $termType(val){ this.$termType.val(val); }
		get $termName(){ return $('#'+NAMESPACE+'termName'); }
		set $termName(val){ this.$termName.val(val); }
		get $termVersion(){ return $('#'+NAMESPACE+'termVersion'); }
		get $termDisplayName(){ return $('#'+NAMESPACE+'termDisplayName'); }
		get $termDefinition(){ return $('#'+NAMESPACE+'termDefinition'); }
		get $termTooltip(){ return $('#'+NAMESPACE+'termTooltip'); }
		get $synonyms(){ return $('#'+NAMESPACE+'synonyms'); }
		get $mandatory(){ return $('#'+NAMESPACE+'mandatory'); }
		set $mandatory(val){ this.$mandatory.prop('disabled', val); }
		get $value(){ return $('#'+NAMESPACE+'value'); }
		set $value(val){ this.$value.val(val); }
		get $abstractKey(){ return $('#'+NAMESPACE+'abstractKey'); }
		set $abstractKey(val){ this.$abstractKey.val(val); }
		get $searchable(){ return $('#'+NAMESPACE+'searchable'); }
		set $searchable(val){ this.$searchable.val(val); }
		get $downloadable(){ return $('#'+NAMESPACE+'downloadable'); }
		set $downloadable(val){ this.$downloadable.val(val); }
		get $disabled(){ return $('#'+NAMESPACE+'disabled'); }
		get $placeHolder(){ return $('#'+NAMESPACE+'placeHolder'); }
		get $minLength(){ return $('#'+NAMESPACE+'minLength'); }
		get $maxLength(){ return $('#'+NAMESPACE+'maxLength'); }
		get $multipleLine(){ return $('#'+NAMESPACE+'multipleLine'); }
		get $validationRule(){ return $('#'+NAMESPACE+'validationRule')}
		get $stringInputSize(){ return $('#'+NAMESPACE+'stringInputSize')}
		get $lineBreak(){ return $('#'+NAMESPACE+'lineBreak')}
		get $numericPlaceHolder(){ return $('#'+NAMESPACE+'numericPlaceHolder')}
		get $minValue(){ return $('#'+NAMESPACE+'minValue')}
		get $maxValue(){ return $('#'+NAMESPACE+'maxValue')}
		get $minBoundary(){ return $('#'+NAMESPACE+'minBoundary')}
		set $minBoundary(val){ this.$minBoundary.prop('disabled', val);}
		get $maxBoundary(){ return $('#'+NAMESPACE+'maxBoundary')}
		set $maxBoundary(val){ this.$maxBoundary.prop('disabled', val);}
		get $unit(){ return $('#'+NAMESPACE+'unit')}
		get $uncertainty(){ return $('#'+NAMESPACE+'uncertainty')}
		get $uncertaintyValue(){ return $('#'+NAMESPACE+'uncertaintyValue')}
		get $sweepable(){ return $('#'+NAMESPACE+'sweepable')}
//		get $displayStyle(){ return $('#'+NAMESPACE+'displayStyle');}
		get $displayStyle(){ return $('input[name="'+NAMESPACE+'displayStyle"]'); }
		get $multiple(){ return $('input[name="'+NAMESPACE+'multiple"]'); }
		get $optionLabel(){ return $('#'+NAMESPACE+'optionLabel')}
		get $optionValue(){ return $('#'+NAMESPACE+'optionValue')}
		get $optionSelected(){ return $('#'+NAMESPACE+'optionSelected')}
		get $optionSlaveterms(){ return $('#'+NAMESPACE+'optionSlaveTerms')}
		get $trueLabel(){ return $('#'+NAMESPACE+'trueLabel')}
		get $falseLabel(){ return $('#'+NAMESPACE+'falseLabel')}
		get $enableTime(){ return $('#'+NAMESPACE+'enableTime')}
		get $startYear(){ return $('#'+NAMESPACE+'startYear')}
		get $endYear(){ return $('#'+NAMESPACE+'endYear')}
		get $allowedExtensions(){ return $('#'+NAMESPACE+'allowedExtensions')}
		get $expanded(){ return $('#'+NAMESPACE+'expanded')}
		get $rows(){ return $('#'+NAMESPACE+'rows')}
		get $columns(){ return $('#'+NAMESPACE+'columns')}
		get $columnWidth(){ return $('#'+NAMESPACE+'columnWidth')}
		get $inputSize(){ return $('#'+NAMESPACE+'inputSize')}
		get $lineBreak(){ return $('#'+NAMESPACE+'lineBreak')}
		get $cssWidth(){ return $('#'+NAMESPACE+'cssWidth')}
		get $cssCustom(){ return $('#'+NAMESPACE+'cssCustom')}
		
		get $optionsBody(){ return $('#'+NAMESPACE+'options')}
		
		get $btnNewTerm(){ return $('#'+NAMESPACE+'btnNewTerm'); }
		set $btnNewTerm(val){ this.$btnNewTerm.prop('disabled', val); }
		get $btnCopyTerm(){ return $('#'+NAMESPACE+'btnCopyTerm'); }
		set $btnCopyTerm(val){ this.$btnCopyTerm.prop('disabled', val); }
		get $btnAdd(){ return $('#'+NAMESPACE+'btnAdd'); }
		set $btnAdd(val){ this.$btnAdd.prop('disabled', val); }
		get $btnClear(){ return $('#'+NAMESPACE+'btnClear'); }
		set $btnClear(val){ this.$btnClear.prop('disabled', val); }
		get $btnImportTerm(){ return $('#'+NAMESPACE+'btnImportTerm'); }
		set $btnImportTerm(val){ this.$btnImportTerm.prop('disabled', val); }
		get $btnUp(){ return $('#'+NAMESPACE+'btnUp'); }
		set $btnUp(val){ this.$btnUp.prop('disabled', val); }
		get $btnDown(){ return $('#'+NAMESPACE+'btnDown'); }
		set $btnDown(val){ this.$btnDown.prop('disabled', val); }
		get $btnNewOption(){ return $('#'+NAMESPACE+'btnNewOption')}
		get $btnAddOption(){ return $('#'+NAMESPACE+'btnAddOption')}
		set $btnAddOption(val){ this.$btnAddOption.prop('disabled', val)}
		get $btnChooseGroupTerms(){ return $('#'+NAMESPACE+'btnChooseGroupTerms'); }
		get $btnSelectColumns(){ return $('#'+NAMESPACE+'btnSelectColumns'); }
		get $btnListChooseSlaveTerms(){ return $('#'+NAMESPACE+'btnListChooseSlaveTerms')}
		set $btnListChooseSlaveTerms(val){ this.$btnListChooseSlaveTerms.prop('disabled', val)}
		get $btnTrueSlaveTerms(){ return $('#'+NAMESPACE+'btnTrueSlaveTerms')}
		get $btnFalseSlaveTerms(){ return $('#'+NAMESPACE+'btnFalseSlaveTerms')}

		attachFormConrolEvents(termType){
			let self = this;
			let dataPacket = new EventDataPacket( NAMESPACE, NAMESPACE );

			switch(termType){
				case TermTypes.STRING:{
					this.$placeHolder.off('change').on('change', function(event){
						dataPacket.value = self.placeHolder;
						dataPacket.attributeName = TermAttributes.PLACE_HOLDER;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$minLength.off('change').on('change', function(event){
						dataPacket.value = self.minLength;
						dataPacket.attributeName = TermAttributes.MIN_LENGTH;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$maxLength.off('change').on('change', function(event){
						dataPacket.value = self.maxLength;
						dataPacket.attributeName = TermAttributes.MAX_LENGTH;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$multipleLine.off('change').on('change', function(event){
						dataPacket.value = self.multipleLine;
						dataPacket.attributeName = TermAttributes.MULTIPLE_LINE;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$validationRule.off('change').on('change', function(event){
						dataPacket.value = self.validationRule;
						dataPacket.attributeName = TermAttributes.VALIDATION_RULE;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$inputSize.off('change').on('change', function(event){
						dataPacket.value = self.inputSize;
						dataPacket.attributeName = TermAttributes.INPUT_SIZE;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$lineBreak.off('change').on('change', function(event){
						dataPacket.value = self.lineBreak;
						dataPacket.attributeName = TermAttributes.LINE_BREAK;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});
					
					break;
				}
				case TermTypes.NUMERIC:{
					this.$minValue.off('change').on('change', function(event){
						dataPacket.value = self.minValue;
						dataPacket.attributeName = TermAttributes.MIN_VALUE;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$maxValue.off('change').on('change', function(event){
						dataPacket.value = self.maxValue;
						dataPacket.attributeName = TermAttributes.MAX_VALUE;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$minBoundary.off('change').on('change', function(event){
						dataPacket.value = self.minBoundary;
						dataPacket.attributeName = TermAttributes.MIN_BOUNDARY;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$maxBoundary.off('change').on('change', function(event){
						dataPacket.value = self.maxBoundary;
						dataPacket.attributeName = TermAttributes.MAX_BOUNDARY;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$unit.off('change').on('change', function(event){
						dataPacket.value = self.unit;
						dataPacket.attributeName = TermAttributes.UNIT;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$uncertainty.off('change').on('change', function(event){
						dataPacket.value = self.uncertainty;
						dataPacket.attributeName = TermAttributes.UNCERTAINTY;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$sweepable.off('change').on('change', function(event){
						dataPacket.value = self.sweepable;
						dataPacket.attributeName = TermAttributes.SWEEPABLE;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$placeHolder.off('change').on('change', function(event){
						dataPacket.value = self.placeHolder;
						dataPacket.attributeName = TermAttributes.PLACE_HOLDER;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$inputSize.off('change').on('change', function(event){
						dataPacket.value = self.inputSize;
						dataPacket.attributeName = TermAttributes.INPUT_SIZE;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$lineBreak.off('change').on('change', function(event){
						dataPacket.value = self.lineBreak;
						dataPacket.attributeName = TermAttributes.LINE_BREAK;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					break;
				}
				case TermTypes.LIST:{
					this.$displayStyle.off('change').on('change', function(event){
						dataPacket.value = self.displayStyle;
						dataPacket.attributeName = TermAttributes.DISPLAY_STYLE;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$multiple.off('change').on('change', function(event){
						dataPacket.value = self.multiple;
						dataPacket.attributeName = TermAttributes.MULTIPLE;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$placeHolder.off('change').on('change', function(event){
						dataPacket.value = self.placeHolder;
						dataPacket.attributeName = TermAttributes.PLACE_HOLDER;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$btnNewOption.off('click').on('click', function(event){
						self.$optionLabel.trigger('focus');
						self.currentOption = new ListOption();
						self.$btnAddOption.prop('disabled', false);
					});

					this.$btnAddOption.off('click').on('click', function(event){
						self.$btnAddOption.prop( 'disabled', true);
						
						if( !self.listOptions ){
							self.listOptions = new Array();
						}
		
						console.log('---self.listOptions: ', self.#currentOption, self.listOptions);
						self.addOption( self.currentOption );
						console.log('self.listOptions---: ', self.currentOption, self.listOptions);
						
						dataPacket.value = self.listOptions;
						dataPacket.attributeName = TermAttributes.OPTIONS;
		
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket);
					});

					this.$btnListChooseSlaveTerms.off('click').on('click', function(event){
						dataPacket.option = self.currentOption;
						dataPacket.TermAttributes = TermAttributes.SLAVE_TERMS;
		
						Util.fire( Events.CHOOSE_SLAVE_TERMS, dataPacket);
					});
		
					this.$optionLabel.off('change').on('change', function(event){
						let label = self.optionLabel;
						if( !label || label.isEmpty() ){
							$.alert({
								title: 'Alert',
								content: Liferay.Language.get('option-label-required')
							});
							$(this).trigger('focus');
							self.currentOption.label = undefined;
							return;
						}
		
						self.currentOption.label = label;
		
						if( self.isCurrentOptionDefined() ){
							self.refreshOptionPreview(self.currentOption, 'option-label');

							dataPacket.value = self.listOptions;
							dataPacket.TermAttributes = TermAttributes.OPTIONS;
		
							Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
						}
					});
					
					this.$optionValue.off('change').on('change', function(event){
						let value = self.optionValue;
						if( Util.isEmptyString(value) ){
							$.alert(Liferay.Language.get('option-value-required'));
							self.optionValue = self.currentOption.value;
							self.$optionValue.trigger('focus');
							
							return;
						}
		
						if( self.listOptions ){
							let uniqueVal = true;
							self.listOptions.every( option => {
								if( option.value === value ){
									uniqueVal = false;
									return Constants.STOP_EVERY;
								}
								return Constants.CONTINUE_EVERY;
							});
		
							if( !uniqueVal ){
								$.alert(Liferay.Language.get('option-value-should-be-unique'));
		
								self.optionValue = self.currentOption.value;
								self.$optionValue.trigger('focus');
								return;
							}
						}
						
						if( !self.currentOption ){
							self.currentOption = new ListOption();
						}
						self.currentOption.value = value;
						
						if( self.isCurrentOptionDefined() ){
							self.refreshOptionPreview(self.currentOption, 'option-value');
		
							dataPacket.value = self.listOptions;
							dataPacket.TermAttributes = TermAttributes.OPTIONS;
		
							Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
						}
					});
					
					break;
				}
				case TermTypes.BOOLEAN:{
					this.$displayStyle.off('change').on('change', function(event){
						dataPacket.value = self.displayStyle;
						dataPacket.attributeName = TermAttributes.DISPLAY_STYLE;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$placeHolder.off('change').on('change', function(event){
						dataPacket.value = self.placeHolder;
						dataPacket.attributeName = TermAttributes.PLACE_HOLDER;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$trueLabel.off('change').on('change', function(event){
						dataPacket.value = self.trueLabel;
						dataPacket.TermAttributes = TermAttributes.TRUE_LABEL;
	
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$falseLabel.off('change').on('change', function(event){
						dataPacket.value = self.valseLabel;
						dataPacket.TermAttributes = TermAttributes.FALSE_LABEL;
	
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$btnTrueSlaveTerms.off('click').on('click', function(event){
						let dataPacket = Util.createEventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.option = true;
		
						Util.fire( Events.CHOOSE_SLAVE_TERMS, dataPacket);
					});
		
					this.$btnFalseSlaveTerms.off('click').on('click', function(event){
						let dataPacket = Util.createEventDataPacket(NAMESPACE, NAMESPACE);
						dataPacket.option = false;
		
						Util.fire( Events.CHOOSE_SLAVE_TERMS, dataPacket);
					});

					break;
				}
				case TermTypes.DATE:{
					this.$enableTime.off('change').on('change', function(event){
						dataPacket.value = self.enableTime;
						dataPacket.attributeName = TermAttributes.ENABLE_TIME;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});

					this.$startYear.off('change').on('change', function(event){
						dataPacket.value = self.startYear;
						dataPacket.attributeName = TermAttributes.START_YEAR;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});
					
					this.$endYear.off('change').on('change', function(event){
						dataPacket.value = self.endYear;
						dataPacket.attributeName = TermAttributes.END_YEAR;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket );
					});
	

					break;
				}
				case TermTypes.FILE:{
					this.$allowedExtensions.off('change').on('change', function(event){
						dataPacket.value = self.allowedExtensions;
						dataPacket.attributeName = TermAttributes.ALLOWED_EXTENSIONS;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket ); 
					});

					break;
				}
				case TermTypes.MATRIX:{
					this.$rows.off('change').on('change', function(event){
						dataPacket.value = self.rows;
						dataPacket.attributeName = TermAttributes.ROWS;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket ); 
					});

					this.$columns.off('change').on('change', function(event){
						dataPacket.value = self.columns;
						dataPacket.attributeName = TermAttributes.COLUMNS;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket ); 
					});

					this.$columnWidth.off('change').on('change', function(event){
						dataPacket.value = self.columnWidth;
						dataPacket.attributeName = TermAttributes.COLUMN_WIDTH;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket ); 
					});

					break;
				}
				case TermTypes.GRID:{
					this.$btnSelectColumns.off('click').on('click', function(event){
						dataPacket.attributeName = TermAttributes.GRID_COLUMNS;
						Util.fire( Events.SELECT_GRID_COLUMNS, dataPacket ); 
					});

					break;
				}
				case TermTypes.GROUP:{
					this.$expanded.off('change').on('change', function(event){
						dataPacket.value = self.expanded;
						dataPacket.attributeName = TermAttributes.EXPANDED;
						Util.fire( Events.TERM_PROPERTY_CHANGED, dataPacket ); 
					});

					this.$btnChooseGroupTerms.off('click').on('click', function(event){
						dataPacket.attributeName = TermAttributes.MASTER_TERM;
						Util.fire( Events.CHOOSE_GROUP_TERMS, dataPacket ); 
					});


					break;
				}

			}
		}

		$getOptionTableColumns( $tr, optionLabel, optionValue, selected, btnClickFunc ){
			$('<td class="option-label" style="width:50%;">' + optionLabel + '</td>').appendTo($tr);
			$('<td class="option-value" style="width:30%;">' + optionValue + '</td>').appendTo($tr);
			let $selected = $('<td class="option-selected" style="width:10%;">').appendTo($tr);
			if( selected ){
				$selected.html('&#10004;');
			}
			let $btnTd = $('<td>').appendTo($tr);
			let $btn = $('<button type="button" class="btn btn-default">').appendTo($btnTd);
			$('<i class="icon-remove" />').appendTo($btn);
			
			$btn.click(btnClickFunc);

			return $tr;
		}

		$getOptionTableRow( optionLabel, optionValue, selected, btnClickFunc){
			let $row = $('<tr>');

			return this.$getOptionTableColumns( $row, optionLabel, optionValue, selected, btnClickFunc );
		}

		$renderListOption( option ){
			let self = this;
			let btnClickFunc = function(event){
				event.stopPropagation();

				self.deleteOption( option );
				
				let dataPacket = Util.createEventDataPacket(NAMESPACE, NAMESPACE);
				dataPacket.option = option;
				dataPacket.options = self.listOptions;
				Util.fire( Events.REMOVE_SLAVE_TERMS, dataPacket);
			};

			option.$defined = this.$getOptionTableRow(
									option.label.getText(CURRENT_LANGUAGE), 
									option.value, 
									option.selected, 
									btnClickFunc).appendTo(this.$optionsBody);
			
			option.$defined.click( function(event){
				event.stopPropagation();

				self.currentOption = option;

				self.highlightOptionPreview( option.$defined );
			} );

			return option.$defined;
		}

		isCurrentOptionDefined(){
			if( !this.listOptions )	return false;

			return this.listOptions.includes( this.currentOption );
		}

		removeOptionPreview( option ){
			option.removePreview();
		}

		clearOptionPreviewHighlight(){
			this.$optionsBody.find('tr').removeClass('highlight-border');
		}

		highlightOptionPreview( $row ){
			this.clearOptionPreviewHighlight();

			$row.addClass('highlight-border');
		}

		clearPreviousOptionSelected(){
			let self = this;

			this.listOptions.every( option => {
				if( option.selected ){
					option.selected = undefined;
					return Constants.STOP_EVERY;
				}

				return Constants.CONTINUE_EVERY;
			});

			this.$optionsBody.find('td.option-selected')
							 .html('');
		}

		refreshOptionPreview( option, column ){
			switch( column ){
				case 'option-label':
					option.$defined.find('td.option-label').first()
							.html( option.labelMap[CURRENT_LANGUAGE] );
					break;
				case 'option-value':
					option.$defined.find('td.option-value').first()
							.empty()
							.html( option.value );
					break;
				case 'option-selected':
					option.$defined.find('td.option-selected').first()
							.empty()
							.html( option.selected ? '&#10004;' : '' );
					break;
			}
		}

		removeOption( targetOption ){
			if( !this.options )	return;

			this.options = this.options.filter( option => option !== targetOption );
			this.currentOption = this.options[0];
			this.dirty = true;
		}

		setOptionForm(){
			let option = this.currentOption;
			if( option instanceof ListOption ){
				this.optionLabel = option.label;
				this.optionValue = option.value;
				this.optionSelected = option.selected;
			}
			else{
				this.optionLabel = undefined;
				this.optionValue = undefined;
				this.optionSelected = undefined;
			}
		}

		disableRenderedBtnGroup( disable ){
			this.$btnAdd = disable;
			this.$termType.prop('disabled', disable);
			this.$btnClear = disable;
			this.$btnCopy = !disable;
		}

		disableMoveBtnGroup( disable ){
			this.$btnUp = disable;
			this.$btnDown = disable;
		}

		disableGroupPropertyGroup( disable ){
			this.$mandatory.prop('disabled', disable);
			this.$abstractKey.prop('disabled', disable);
			this.$downloadable.prop('disabled', disable);
			this.$searchable.prop('disabled', disable);
			this.$value.prop('disabled', disable);
		}
	}

	class DataStructure {
		static DEFAULT_TERM_DELIMITER = ';';
		static DEFAULT_TERM_DELIMITER_POSITION = 'end';
		static DEFAULT_TERM_VALUE_DELIMITER = 'equal';
		static DEFAULT_MATRIX_BRACKET_TYPE = '[]';
		static DEFAULT_MATRIX_ELEMENT_DELIMITER = 'space';
		static DEFAULT_COMMENT_CHAR = '#';

		static DEFAULT_FIELD_OPERATOR = 'or';
		static DEFAULT_INFIELD_OPERATOR = 'or';

		#availableTermNames;
		#availableDisplayNames;

		#inputStatusDisplay;
		#goTo;
		#itemNoDisplay;
		#resourceCommandURL;
		#termTypeRenderURL;
		#dataTypeId;
		#dataTypeName;
		#dataTypeDisplayName;
		#dataTypeVersion;
		#structuredDataId;
		#terms;
		#currentTerm;
		#forWhat;
		#$canvas;

		#termDelimiter;
		#termDelimiterPosition;
		#termValueDelimiter;
		#matrixBracketType;
		#matrixElementDelimiter;
		#commentChar;

		#propertyForm;
		#dirty;

		/***********************************************************************
		 *  getters and setters
		 ***********************************************************************/

		get resourceCommandURL(){return this.#resourceCommandURL;}
		set resourceCommandURL(url){this.#resourceCommandURL = url;}
		get termTypeRenderURL(){return this.#termTypeRenderURL;}
		set termTypeRenderURL(url){this.#termTypeRenderURL = url;}
		get dataTypeId(){return this.#dataTypeId;}
		set dataTypeId(id){this.#dataTypeId = Util.toSafeNumber(id);}
		get dataTypeName(){return this.#dataTypeName;}
		set dataTypeName(dataTypeName){this.#dataTypeName = dataTypeName;}
		get dataTypeDisplayName(){return this.#dataTypeDisplayName;}
		set dataTypeDisplayName(dataTypeDisplayName){this.#dataTypeDisplayName = dataTypeDisplayName;}
		get dataTypeVersion(){return this.#dataTypeVersion;}
		set dataTypeVersion(dataTypeVersion){this.#dataTypeVersion = dataTypeVersion;}
		get structuredDataId(){return this.#structuredDataId;}
		set structuredDataId(structuredDataId){
			this.#structuredDataId = Util.toSafeNumber(structuredDataId);
		}
		get title(){ return this.dataTypeDisplayName + ' v.' + this.dataTypeVersion + ' No.' + this.structuredDataId; }

		get terms(){return this.#terms;}
		set terms( terms ){ this.#terms = terms; }
		get currentTerm(){return this.#currentTerm;}
		set currentTerm( term ){ this.#currentTerm = term; }
		get forWhat(){return this.#forWhat;}
		set forWhat( forWhat ){ this.#forWhat = forWhat; }
		get $canvas(){return this.#$canvas;}
		set $canvas( $canvas ){ this.#$canvas = $canvas;}
		get dirty(){return this.#dirty;}
		set dirty( dirty ){ this.#dirty = dirty;}

		get termDelimiter(){
			return this.#termDelimiter;
		}
		set termDelimiter( val ){ 
			this.#termDelimiter = $.isEmptyObject(val) ? '\n' : val;
		}
		get termDelimiterPosition(){
			return this.#termDelimiterPosition;
		}
		set termDelimiterPosition( val ){ 
			this.#termDelimiterPosition = $.isEmptyObject(val) ? undefined : val;
		}
		get termValueDelimiter(){
			return this.#termValueDelimiter;
		}
		set termValueDelimiter( val ){ 
			this.#termValueDelimiter = $.isEmptyObject(val) ? undefined : val;
		}
		get matrixBracketType(){
			return this.#matrixBracketType;
		}
		set matrixBracketType( val ){ 
			this.#matrixBracketType = $.isEmptyObject(val) ? undefined : val;
		}
		get matrixElementDelimiter(){
			return this.#matrixElementDelimiter;
		}
		set matrixElementDelimiter( val ){ 
			this.#matrixElementDelimiter = $.isEmptyObject(val) ? undefined : val;
		}
		get commentChar(){
			return this.#commentChar;
		}
		set commentChar( val ){ 
			this.#commentChar = $.isEmptyObject(val) ? undefined : val;
		}
		get inputStatusDisplay(){
			return this.#inputStatusDisplay;
		}
		set inputStatusDisplay( val ){
			this.#inputStatusDisplay = Util.toSafeBoolean(val);
		}
		get goTo(){
			return this.#goTo;
		}
		set goTo( val ){
			this.#goTo = Util.toSafeBoolean(val);
		}
		get itemNoDisplay(){
			return this.#itemNoDisplay;
		}
		set itemNoDisplay( val ){
			this.#itemNoDisplay = Util.toSafeBoolean(val);
		}

		get $termDelimiter(){ return $('#'+NAMESPACE+'termDelimiter')}
		get $termDelimiterPosition(){ return $('#'+NAMESPACE+'termDelimiterPosition')}
		get $termValueDelimiter(){ return $('#'+NAMESPACE+'termValueDelimiter')}
		get $matrixBracketType(){ return $('#'+NAMESPACE+'matrixBracketType')}
		get $matrixElementDelimiter(){ return $('#'+NAMESPACE+'matrixElementDelimiter')}
		get $commentChar(){ return $('#'+NAMESPACE+'commentChar')}
		get $inputStatusDisplay(){ return $('#'+NAMESPACE+'inputStatusDisplay')}
		get $inputStatusBar(){ return $('#'+NAMESPACE+'inputStatusBar'); }
		get $goTo(){ return $('#'+NAMESPACE+'goTo'); }
		get $goToBar(){ return $('#'+NAMESPACE+'goToBar'); }
		get $itemNoDisplay(){ return $('#'+NAMESPACE+'itemNoDisplay'); }
		get $goToCategory(){ return $('#'+NAMESPACE+'goToCategory'); }
		get $goToSelector(){ return $('#'+NAMESPACE+'goToSelector'); }

		get propertyForm(){ return this.#propertyForm; }

		/***********************************************************************
		 *  Constructor
		 ***********************************************************************/
		constructor( jsonObj, profile, forWhat, $canvas ){
			
			this.termDelimiter= DataStructure.DEFAULT_TERM_DELIMITER;
			this.termDelimiterPosition = DataStructure.DEFAULT_TERM_DELIMITER_POSITION;
			this.termValueDelimiter = DataStructure.DEFAULT_TERM_VALUE_DELIMITER;
			this.matrixBracketType = DataStructure.DEFAULT_MATRIX_BRACKET_TYPE;
			this.matrixElementDelimiter = DataStructure.DEFAULT_MATRIX_ELEMENT_DELIMITER;
			this.commentChar = DataStructure.DEFAULT_COMMENT_CHAR;
			this.inputStatusDisplay = false;
			this.goTo = false;

			this.forWhat = forWhat;
			this.$canvas = $canvas;

			if( forWhat === Constants.FOR_PREVIEW ){
				this.#propertyForm = new TermPropertiesForm();
			}

			if( !$.isEmptyObject(jsonObj) ){
				this.parse( jsonObj );
			}

			if( profile ){
				if( profile.resourceCommandURL ){
					this.resourceCommandURL = profile.resourceCommandURL;
					this.termTypeRenderURL = profile.termTypeRenderURL;
				}
				if( profile.dataTypeId )
					this.dataTypeId = profile.dataTypeId;
				if( profile.dataTypeName )
					this.dataTypeName = profile.dataTypeName;
				if( profile.dataTypeDisplayName )
					this.dataTypeDisplayName = profile.dataTypeDisplayName;
				if( profile.dataTypeVersion )
					this.dataTypeVersion = profile.dataTypeVersion;
				if( profile.structuredDataId )
					this.structuredDataId = profile.structuredDataId;
			}
			
			this.dirty = false;

			this.inputStatusDisplay ? 
					this.$inputStatusBar.show() :
					this.$inputStatusBar.hide();

			this.configureGoToOptions();

			/**************************************************
			 *  Event Handlers for data structure
			**************************************************/
			let dataStructure = this;

			if( this.forWhat === Constants.FOR_PREVIEW ){
				this.$termDelimiter.val(this.termDelimiter);
				this.$termDelimiterPosition.val(this.termDelimiterPosition);
				this.$termValueDelimiter.val(this.termValueDelimiter);
				this.$matrixBracketType.val(this.matrixBracketType);
				this.$matrixElementDelimiter.val(this.matrixElementDelimiter);
				this.$commentChar.val(this.commentChar);
				this.$inputStatusDisplay.prop('checked', this.inputStatusDisplay);
				this.$goTo.prop('checked', this.goTo);

				/**************************************************************
				* Change Event handlers for form controls 
				***************************************************************/
				this.$termDelimiter.change(function(event){
					dataStructure.termDelimiter = FormUIUtil.getFormValue( 'termDelimiter' );
				});
				
				this.$termDelimiterPosition.change(function(event){
					dataStructure.termDelimiterPosition = FormUIUtil.getFormValue( 'termDelimiterPosition' );
				});
				
				this.$termValueDelimiter.change(function(event){
					dataStructure.termValueDelimiter = FormUIUtil.getFormValue( 'termValueDelimiter' );
				});
			
				this.$matrixBracketType.change(function(event){
					dataStructure.matrixBracketType = FormUIUtil.getFormValue( 'matrixBracketType' );
				});
				
				this.$matrixElementDelimiter.change(function(event){
					dataStructure.matrixElementDelimiter = FormUIUtil.getFormValue( 'matrixElementDelimiter' );
				});
			
				this.$commentChar.change(function(event){
					dataStructure.commentChar = FormUIUtil.getFormValue( 'commentChar' );
				});
				
				this.$inputStatusDisplay.change( function(event){
					dataStructure.inputStatusDisplay = FormUIUtil.getFormCheckboxValue( 'inputStatusDisplay' );
					dataStructure.displayInputStatus();
					dataStructure.inputStatusDisplay ? 
								dataStructure.$inputStatusBar.show() :
								dataStructure.$inputStatusBar.hide();
				});

				Liferay.on( Events.TERM_PROPERTY_CHANGED, function(event){
					let dataPacket = event.dataPacket;

					switch( dataPacket.attributeName ){
						case TermAttributes.TERM_TYPE:{
							let selectedTermType = dataPacket.value;
							let currentTerm = dataStructure.currentTerm;
							
							if( currentTerm.isRendered() ){
								$.alert({
									title: Liferay.Language.get('term-type-change-alert'),
									content: Liferay.Language.get('how-to-term-type-change')
								});

								dataStructure.propertyForm.termType = currentTerm.termType;
							}
							else{
								dataStructure.setCurrentTerm( 
									dataStructure.createTerm(selectedTermType) );
							}
							break;
						}
						case TermAttributes.TERM_NAME:{
							let currentTerm = dataStructure.currentTerm;

							let changedName = dataPacket.value;
							if( !Term.validateTermName(changedName) ){
								$.alert( changedName + 'is not valid. Try another name.' );
								FormUIUtil.setFormValue(DataStructure.TagIds.TERM_NAME, currentTerm.termName);
								return;
							}

							if( dataStructure.exist( changedName ) ){
								$.alert( changedName + 'already exist. Should be changed another name.' );
								dataStructure.propertyForm.termName = currentTerm.termName;
							}
							else if( currentTerm.validateNameExpression( changedName ) === false ){
								$.alert( 'Term Name[' + changedName +'] is unvalid for a term name. Try another one.');
								dataStructure.propertyForm.termName = currentTerm.termName;
							} 
							
							if( currentTerm.isRendered() ){
								// It means the current term is one of the data structure and previewed on the preview panel.
								// Therefore, we must confirm that the term's name be changed before the preview changed.
								$.confirm({
									title: Liferay.Language.get('select-term-type'),
									content: Liferay.Language.get('this-term-is-previewed-are-you-sure-to-change-the-name-of-the-term'),
									type: 'orange',
									typeAnimated: true,
									buttons:{
										ok: {
											text: 'OK',
											btnClass: 'btn-blue',
											action: function(){
												currentTerm.termName = changedName;
												dataStructure.refreshTerm( currentTerm );
											}
										},
										cancel: function(){
											dataStructure.propertyForm.termName = currentTerm.termName;
										}
									},
									draggable: true
								}); 
							}
							else{
								currentTerm.termName = changedName;
							}
							break;
						}
						case TermAttributes.TERM_VERSION:{
							let currentTerm = dataStructure.currentTerm;

							const changedVersion = dataPacket.value;
							
							let validated;
							if( currentTerm.$rendered ){
								validated = Term.validateTermVersion( changedVersion, currentTerm.termVersion );
							}
							else{
								validated = Term.validateTermVersion( changedVersion );
							}
							
							if( validated === true ){
								currentTerm.termVersion = changedVersion;
								
							}
							else{
								if( Util.isEmptyString(changedVersion) ){
									$.alert( Liferay.Language.get('term-version-is-required') );
								}
								else{
									$.alert( Liferay.Language.get('wrong-term-version-format')  );
								}
								
								dataStructure.propertyForm.termVersion = currentTerm.termVersion;
							} 
							break;
						}
						case TermAttributes.DISPLAY_NAME:{
							dataStructure.currentTerm.displayName = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.DEFINITION:{
							dataStructure.currentTerm.definition = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.ABSTRACT_KEY:{
							dataStructure.currentTerm.abstractKey = dataPacket.value;
							break;
						}
						case TermAttributes.DISABLED:{
							dataStructure.currentTerm.disabled = dataPacket.value;
							dataStructure.disableGroup( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.SEARCHABLE:{
							dataStructure.currentTerm.searchable = dataPacket.value;
							break;
						}
						case TermAttributes.DOWNLOADABLE:{
							dataStructure.currentTerm.downloadable = dataPacket.value;
							break;
						}
						case TermAttributes.TOOLTIP:{
							dataStructure.currentTerm.tooltip = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.SYNONYMS:{
							dataStructure.currentTerm.synonyms = dataPacket.value;
							break;
						}
						case TermAttributes.MANDATORY:{
							dataStructure.currentTerm.mandatory = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.CSS_WIDTH:{
							dataStructure.currentTerm.cssWidth = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.CSS_CUSTOM:{
							dataStructure.currentTerm.cssCustom = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.VALUE:{
							dataStructure.currentTerm.value = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );

							/*
							let packet = Util.createEventDataPacket(NAMESPACE, NAMESPACE);
							packet.term = dataStructure.currentTerm;
							Util.fire( Events.TERM_VALUE_CHANGED, packet );
							*/
							break;
						}
						case TermAttributes.PLACE_HOLDER:{
							dataStructure.currentTerm.placeHolder = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.MIN_LENGTH:{
							dataStructure.currentTerm.minLength = dataPacket.value;
							break;
						}
						case TermAttributes.MAX_LENGTH:{
							dataStructure.currentTerm.maxLength = dataPacket.value;
							break;
						}
						case TermAttributes.MULTIPLE_LINE:{
							dataStructure.currentTerm.multipleLine = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.VALIDATION_RULE:{
							dataStructure.currentTerm.validationRule = dataPacket.value;
							break;
						}
						case TermAttributes.INPUT_SIZE:{
							dataStructure.currentTerm.inputSize = dataPacket.value;
							break;
						}
						case TermAttributes.LINE_BREAK:{
							dataStructure.currentTerm.lineBreak = dataPacket.value;
							break;
						}
						case TermAttributes.MIN_VALUE:{
							let currentTerm = dataStructure.currentTerm;

							const preValue = currentTerm.minValue;
							const minValue = Util.toSafeNumber(dataStructure.propertyForm.minValue);
							
							if( minValue === undefined ){
								currentTerm.minValue = undefined;
								currentTerm.minBoundary = undefined;
								dataStructure.propertyForm.minBoundary = false;
								dataStructure.propertyForm.$minBoundary = true;
							}
							else{
								if( isNaN(minValue) ){
									if( isNaN(preValue) ){
										currentTerm.minBoundary = false;
										dataStructure.propertyForm.minBoundary = false;
										dataStructure.propertyForm.$minBoundary = true;
										dataStructure.propertyForm.minValue = undefined;
									}
									else{
										dataStructure.propertyForm.minValue = preValue;
										dataStructure.propertyForm.$minBoundary = false;
									}
								}
								else{
									dataStructure.propertyForm.$minBoundary = false;
									currentTerm.minValue = minValue;
									dataStructure.propertyForm.minValue = currentTerm.minValue;
								}
							}
			
							
							if( preValue !== minValue ){
								dataStructure.refreshTerm( currentTerm );
							}
							break;
						}
						case TermAttributes.MAX_VALUE:{
							let currentTerm = dataStructure.currentTerm;

							const preValue = currentTerm.maxValue;
							const maxValue = Util.toSafeNumber(dataStructure.propertyForm.maxValue);

							if( maxValue === undefined ){
								currentTerm.maxValue = undefined;
								currentTerm.maxBoundary = undefined;
								dataStructure.propertyForm.maxBoundary = false;
								dataStructure.propertyForm.$maxBoundary = true;
							}
							else{
								if( isNaN(maxValue) ){
									if( isNaN(preValue) ){
										currentTerm.maxBoundary = false;
										dataStructure.propertyForm.maxBoundary = false;
										dataStructure.propertyForm.maxValue = undefined;
										dataStructure.propertyForm.$maxBoundary = true;
									}
									else{
										dataStructure.propertyForm.maxValue = preValue;
										dataStructure.propertyForm.$maxBoundary = false;
									}
								}
								else{
									dataStructure.propertyForm.$maxBoundary = false;
									currentTerm.maxValue = maxValue;
									dataStructure.propertyForm.maxValue = currentTerm.maxValue;
								}
							}

							if( preValue !== maxValue ){
								dataStructure.refreshTerm( currentTerm );
							}
							break;
						}
						case TermAttributes.MIN_BOUNDARY:{
							dataStructure.currentTerm.minBoundary = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.MAX_BOUNDARY:{
							dataStructure.currentTerm.maxBoundary = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.UNIT:{
							dataStructure.currentTerm.unit = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.UNCERTAINTY:{
							dataStructure.currentTerm.uncertainty = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.SWEEPABLE:{
							dataStructure.currentTerm.sweepable = dataPacket.value;
							break;
						}
						case TermAttributes.DISPLAY_STYLE:{
							dataStructure.currentTerm.displayStyle = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.MULTIPLE:{
							dataStructure.currentTerm.multiple = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.OPTIONS:{
							dataStructure.currentTerm.options = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.SLAVE_TERMS:{
							dataStructure.chooseSlaveTerms( dataStructure.currentTerm, dataPacket.value );
							break;
						}
						case TermAttributes.TRUE_LABEL:{
							dataStructure.currentTerm.trueLabel = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.FALSE_LABEL:{
							dataStructure.currentTerm.falseLabel = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.ENABLE_TIME:{
							dataStructure.currentTerm.enableTime = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.START_YEAR:{
							dataStructure.currentTerm.startYear = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.END_YEAR:{
							dataStructure.currentTerm.endYear = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.ALLOWED_EXTENSIONS:{
							dataStructure.currentTerm.allowedExtensions = dataPacket.value;
							break;
						}
						case TermAttributes.EXPANDED:{
							dataStructure.currentTerm.expanded = dataPacket.value;
							dataStructure.expandGroup( dataStructure.currentTerm, 
													   dataStructure.currentTerm.expanded );
							break;
						}
						case TermAttributes.ROWS:{
							dataStructure.currentTerm.rows = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.COLUMNS:{
							dataStructure.currentTerm.columns = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
						case TermAttributes.COLUMN_WIDTH:{
							dataStructure.currentTerm.columnWidth = dataPacket.value;
							dataStructure.refreshTerm( dataStructure.currentTerm );
							break;
						}
					}

					console.log('Form value changed: ', dataPacket, dataStructure.currentTerm );
				});

				Liferay.on( Events.REMOVE_SLAVE_TERMS, function(event){
					let dataPacket = event.dataPacket;
							
					if( !dataPacket.isTargetPortlet(NAMESPACE) ){
						return;
					}
			
					dataStructure.currentTerm.options = dataPacket.options;

					console.log( 'LIST_OPTION_PREVIEW_REMOVED: ', dataPacket );

					let slaveTermNames = dataPacket.option.slaveTerms;
					if( !!slaveTermNames ){
						slaveTermNames.forEach( termName => {
							let term = dataStructure.getTermByName( termName );
							term.masterTerm = undefined;
							term.$rendered.show();
						});
					}
					
					dataStructure.refreshTerm( dataStructure.currentTerm );
				});

				Liferay.on(Events.DATATYPE_PREVIEW_COPY_TERM, function(event){
					let dataPacket = event.dataPacket;
					 
					if( !dataPacket.isTargetPortlet(NAMESPACE) ){
						return;
					}
					
					console.log('DATATYPE_PREVIEW_COPY_TERM', dataPacket);
					
					let copiedTerm = dataStructure.copyTerm( dataPacket.term );
					dataStructure.setCurrentTerm( copiedTerm, false );

					if( copiedTerm.isGroupTerm() ){
						dataStructure.expandGroup( copiedTerm, true, false); 
					}
				});
				
				Liferay.on( Events.CHOOSE_SLAVE_TERMS, function( event ){
					let dataPacket = event.dataPacket;
							
					if( !dataPacket.isTargetPortlet(NAMESPACE) ){
						return;
					}

					let option = (typeof dataPacket.option === 'object') ?
											dataPacket.option :
											(dataPacket.option ? dataStructure.currentTerm.trueOption :
																 dataStructure.currentTerm.falseOption);
			
					dataStructure.chooseSlaveTerms( dataStructure.currentTerm, option );
				});

				Liferay.on( Events.CHOOSE_GROUP_TERMS, function( event ){
					let dataPacket = event.dataPacket;
							
					if( !dataPacket.isTargetPortlet(NAMESPACE) ){
						return;
					}
				
					dataStructure.chooseGroupTerms( dataStructure.currentTerm );
				});

				Liferay.on( Events.SELECT_GRID_COLUMNS, function( event ){
					let dataPacket = event.dataPacket;
							
					if( !dataPacket.isTargetPortlet(NAMESPACE) ){
						return;
					}
				
					dataStructure.selectGridColumns( dataStructure.currentTerm );
				});

				Liferay.on( Events.DATATYPE_PREVIEW_DELETE_TERM, function( event ){
					let dataPacket = event.dataPacket;
					
					if( !dataPacket.isTargetPortlet(NAMESPACE) ){
						return;
					}
					console.log( 'received DATATYPE_PREVIEW_DELETE_TERM: ', dataPacket);

					let targetTerm = dataPacket.term;
					let deleteChildren = dataPacket.children;

					dataStructure.deleteTerm( targetTerm, deleteChildren );
					
					dataStructure.refreshGroupMemberOrders( targetTerm.groupId );

					if( dataStructure.currentTerm === targetTerm ){
						dataStructure.currentTerm = undefined;
					}
		
					let siblings = dataStructure.getGroupMembers(targetTerm.groupId);
		
					if( siblings.length > 0 ){
						dataStructure.setCurrentTerm( siblings[0], true );
					}
					else{
						if( targetTerm.isMemberOfGroup() ){
							dataStructure.setCurrentTerm( dataStructure.getGroupTerm(targetTerm), true );
						}
						else{
							let topLevelTerms = dataStructure.getGroupMembers();
							if( topLevelTerms.length > 0 ){
								dataStructure.setCurrentTerm( topLevelTerms[0] )
							}
						}
					}

					if( dataStructure.inputStatusDisplay ){
						dataStructure.displayInputStatus();
					}
		
					if( dataStructure.goTo ){
						dataStructure.configureGoToOptions();
					}
				});

				Liferay.on( Events.DATATYPE_PREVIEW_GROUPUP_TERM, function( event ){
					let dataPacket = event.dataPacket;
					
					if( !dataPacket.isTargetPortlet(NAMESPACE) ){
						return;
					}
					console.log( 'received DATATYPE_PREVIEW_GROUPUP_TERM: ', dataPacket);
					
					dataStructure.moveTermGroupUp( dataPacket.term );
					dataStructure.setCurrentTerm( dataPacket.term );
				});
	
				
				/*******************************************************************************
				* Event handlers for buttons
				*******************************************************************************/
				this.propertyForm.$btnNewTerm.click(function(){
					dataStructure.setCurrentTerm( 
							dataStructure.createTerm(dataStructure.propertyForm.termType) );
					dataStructure.propertyForm.$termVersion.trigger('focus');
				});

				this.propertyForm.$btnCopyTerm.click(function(){
					let copiedTerm = dataStructure.copyTerm( dataStructure.currentTerm );
					dataStructure.setCurrentTerm( copiedTerm, false );
					dataStructure.collapseOtherGroups( copiedTerm, true );
				});
			
				this.propertyForm.$btnClear.click(function(){
					dataStructure.setCurrentTerm( 
							dataStructure.createTerm( dataStructure.currentTerm.termType ) );
				});
			
				this.propertyForm.$btnImportTerm.click(function(){

					//$.alert('Under Construction.');
				});
				
				this.propertyForm.$btnUp.click(function(event){
					if( !dataStructure.currentTerm.isRendered() ){
						return;
					}
					
					dataStructure.moveUpTerm( dataStructure.currentTerm );
				});
				
				this.propertyForm.$btnDown.click(function(event){
					if( !dataStructure.currentTerm.isRendered() ){
						return;
					}
					
					dataStructure.moveDownTerm( dataStructure.currentTerm );
				});

				this.propertyForm.$btnAdd.click(function(){
					if( dataStructure.currentTerm.termType === TermTypes.LIST ){
						if( !dataStructure.currentTerm.options ||
							dataStructure.currentTerm.options.length < 2 ){
							$.alert( 'List type terms must have at leat 2 options');
							return;
						}
					}

					console.log( 'new term order: ' + dataStructure.currentTerm.order );
					dataStructure.addTerm( dataStructure.currentTerm,  0 );
					console.log( 'new term order - 2: ' + dataStructure.currentTerm.order );
					if( !dataStructure.currentTerm.isRendered() ){
						dataStructure.$renderTerm( dataStructure.currentTerm, true );
					}
					/*
					dataStructure.insertGroupMember( 
										null, 
										dataStructure.currentTerm );
					*/
					dataStructure.propertyForm.disableMoveBtnGroup( false );

					if( dataStructure.inputStatusDisplay ){
						dataStructure.displayGroupInputStatus(null);
					}

					if( dataStructure.goTo ){
						dataStructure.configureGoToOptions();
					}
				});

			}

			this.$itemNoDisplay.on('change', function(event){
				dataStructure.itemNoDisplay = Util.toSafeBoolean( $(this).prop('checked') );
				dataStructure.render();
			});

			this.$goTo.change( function(event){
				dataStructure.goTo = FormUIUtil.getFormCheckboxValue( 'goTo' );
				dataStructure.configureGoToOptions();
			});

			this.$goToCategory.change( function(event){
				dataStructure.setGoToCategory();
			});

			this.$goToSelector.on('change', function(event){
				let val = dataStructure.$goToSelector.val();

				let term = dataStructure.getAvailableGoToTerm( val );

				if( !term ){
					$.alert('There is no term containing ' + val);
					return;
				}
				
				let dataPacket = Util.createEventDataPacket(NAMESPACE, NAMESPACE);
				dataPacket.source = 'goTo';
				dataPacket.term = term;
				dataPacket.fromClick = false;
			
				Util.fire( Events.DATATYPE_TERM_SELECTED, dataPacket );
			});

			Liferay.on(Events.DATATYPE_TERM_SELECTED, function(event){
				let dataPacket = event.dataPacket;
				if( !dataPacket.isTargetPortlet(NAMESPACE) ){
					return;
				}
				console.log( 'DATATYPE_TERM_SELECTED: ', event.dataPacket );
				
				dataStructure.setCurrentTerm( dataPacket.term, dataPacket.fromClick );
			});

			Liferay.on(Events.GRID_COLUMN_SELECTED, function(event){
				let dataPacket = event.dataPacket;
				if( !dataPacket.isTargetPortlet(NAMESPACE) ){
					return;
				}
				console.log( 'GRID_COLUMN_SELECTED: ', event.dataPacket );
				
				if( dataPacket.status ){
					dataStructure.setCurrentTerm( dataPacket.column, dataPacket.fromClick );
				}
				else{
					dataStructure.setCurrentTerm( dataPacket.term, dataPacket.fromClick );
				}
			});
			
			Liferay.on(Events.TERM_VALUE_CHANGED, function(event){
				let packet = event.dataPacket;

				if( packet.targetPortlet !== NAMESPACE ){
					return;
				}

				console.log('TERM_VALUE_CHANGED received: ', packet );
				let term = packet.term;
				if( term.termType === TermTypes.GRID ){
					let column = packet.column;
					let columnType = column ? column.termType : '';

					switch( columnType ){
						case TermTypes.STRING:{
							if( !column.validate( packet.value ) ){
								$.alert( 'Invalid string for: ' + column.termName );
								packet.$source.val( term.getCellValue( packet.row, column.termName ) );
								return;
							}
							term.setCellValue( packet.row, column.termName, packet.value );

							if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
								dataStructure.propertyForm.value = packet.value;
							}

							break;
						}
						case TermTypes.NUMERIC:{
							let attribute = packet.attribute;

							let value = Util.toSafeNumber( packet.value );

							if( attribute === TermAttributes.VALUE ){
								if( (Util.isNotEmpty(packet.value) && value === undefined) ||
									 !column.validate( value )){
									$.alert('Invalid input for numeric term: ' + packet.value);
									let curVal = term.getNumericCellValue( packet.row, column.termName );
									packet.$source.val( curVal );
									return;
								}

								term.setNumericCellValue( packet.row, column.termName, value );
							}
							else if( attribute === TermAttributes.UNCERTAINTY_VALUE ){
								if( Util.isNotEmpty(packet.value) && value === undefined ){
									$.alert('Invalid number for uncertainty: ' + packet.value);
									let curVal = term.getNumericCellUncertainty( packet.row, column.termName );
									packet.$source.val( curVal );
									return;
								}

								term.setNumericCellUncertainty( packet.row, column.termName, value );
							}

							if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
								dataStructure.propertyForm.value = value;
							}

							break;
						}
						case TermTypes.LIST:{
							term.setCellValue( packet.row, column.termName, packet.value );

							if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
								dataStructure.propertyForm.value = packet.value;
							}

							break;
						}
						case TermTypes.BOOLEAN:{
							term.setCellValue( packet.row, column.termName, Util.toSafeBoolean(packet.value) );

							if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
								dataStructure.propertyForm.value = packet.value;
							}

							break;
						}
						case TermTypes.DATE:{
							term.setCellValue( packet.row, column.termName, packet.value );

							break;
						}
						case TermTypes.ADDRESS:{
							term.setCellValue( packet.row, column.termName, packet.value );

							break;
						}
						case TermTypes.PHONE:{
							let value = packet.value;
							if( !column.validate( value ) ){
								$.alert('Wrong format[999-9999-9999]: ' + value );
								packet.$source.val( term.getCellValue( packet.row, column.termName ) );
								return;
							}

							term.setCellValue( packet.row, column.termName, value );

							break;
						}
						case TermTypes.EMAIL:{
							let value = packet.value;
							if( !column.validate( value ) ){
								$.alert('Wrong format[xxxxxx@xxxxxx]: ' + value );
								packet.$source.val( term.getCellValue( packet.row, column.termName ) );
								return;
							}

							term.setCellValue( packet.row, column.termName, packet.value );

							break;
						}
					}
					
					dataStructure.fireStructuredDataChangedEvent();
				}
				else{
					switch( term.termType ){
						case TermTypes.STRING:{
							if( !term.validate( packet.value ) ){
								$.alert( 'Invalid string for: ' + term.termName + ' ' + packet.value );
								packet.$source.val( term.value );
								return;
							}
							term.value = packet.value;
							if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
								dataStructure.propertyForm.value = term.value;
							}

							dataStructure.fireStructuredDataChangedEvent();
							break;
						}
						case TermTypes.NUMERIC:{
							let value = Util.toSafeNumber( packet.value );
							
							if( packet.attribute === TermAttributes.VALUE ){
								// Invalid input handling
								if( (Util.isNotEmpty(packet.value) && value === undefined) ||
									 !term.validate( value ) ){
									$.alert( 'Invalid numeric for: ' + term.termName + ' ' + packet.value );
									let curVal = term.value;
									(typeof curVal === 'object') ? 
										packet.$source.val( curVal.value ) :
										packet.$source.val( curVal );

									return;
								}

								term.value = value;

								if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
									dataStructure.propertyForm.value = term.value;
								}
							}
							else if( packet.attribute === TermAttributes.UNCERTAINTY_VALUE ){
								// Invalid input handling
								if( (Util.isNotEmpty(packet.value) && value === undefined) ){
									$.alert( 'Invalid numeric for uncertainty: ' + term.termName + ' ' + packet.value );
									let curVal = term.uncertaintyValue;
									(typeof curVal === 'object') ? 
										packet.$source.val( curVal.uncertainty ) :
										packet.$source.val( curVal );

									return;
								}

								term.uncertaintyValue = value;
							}
							
							dataStructure.fireStructuredDataChangedEvent();
							break;
						}
						case TermTypes.LIST:{
							console.log('List value changed: ', packet);
							term.value = packet.value;

							dataStructure.activateSlaveTerms( term );
							if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
								dataStructure.propertyForm.value = 
									term.hasValue() ? term.value.join( ',' ) : '';
							}
							
							dataStructure.fireStructuredDataChangedEvent();
							break;
						}
						case TermTypes.BOOLEAN:{
							console.log()
							term.value = packet.value;

							dataStructure.activateSlaveTerms( term );
							if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
								dataStructure.propertyForm.value = term.value;
							}

							dataStructure.fireStructuredDataChangedEvent();
							break;
						}
						case TermTypes.FILE:{
							let cmd = packet.cmd;
							
							let uploadForm = new FormData();
							uploadForm.append(NAMESPACE+'command', cmd);
		
							
							if( cmd === Constants.Commands.UPLOAD_DATA_FILE ){
								let files = packet.value;

								let fileCount = 0;
								if( files.length > 0 ){
									let $fileListTable = term.$rendered.find('table').first();
									$fileListTable.show();
									
									for( let i=0; i<files.length; i++){
										if( term.addFile( undefined, undefined, files[i]) ){
											fileCount++;
										}
									};
								}

								if( fileCount === 0 )	return;

								uploadForm.append(NAMESPACE+'dataTypeId', dataStructure.dataTypeId);
								uploadForm.append(NAMESPACE+'dataTypeName', dataStructure.dataTypeName);
								uploadForm.append(NAMESPACE+'dataTypeVersion', dataStructure.dataTypeVersion);
								uploadForm.append(NAMESPACE+'structuredDataId', dataStructure.structuredDataId);
								uploadForm.append(NAMESPACE+'termName', term.termName);
								uploadForm.append(NAMESPACE+'termVersion', term.termVersion);
		
								for( let fileName in term.files ){
									let file = term.files[fileName];
		
									if( !file.fileId ){
										uploadForm.append(NAMESPACE+term.termName, file.file );
									}
								}

								uploadForm.append(NAMESPACE+'fileContent', dataStructure.toDBContent() );
							}
							else if( cmd === Constants.Commands.DELETE_DATA_FILE ){
								uploadForm.append(NAMESPACE+'fileName', packet.fileName);
								uploadForm.append(NAMESPACE+'fileId', packet.fileId);
							}

							$.ajax({
								url: dataStructure.resourceCommandURL,
								type: 'post',
								enctype: 'multipart/form-data',
								contentType: false,
								processData: false,
								dataType: 'json',
								data: uploadForm,
								beforeSend: function(){
									console.log('before file upload');
								},
								xhr: function() {
									let xhr = new window.XMLHttpRequest();
									xhr.upload.addEventListener("progress", function(evt) {
										if (evt.lengthComputable) {
											let percentComplete = (evt.loaded / evt.total) * 100;
										}
									}, false);
									return xhr;
								},
								success: function(result){
									if( result.hasOwnProperty('structuredDataId') ){
										dataStructure.structuredDataId = Util.toSafeNumber(result.structuredDataId);
									}
		
									if( result.cmd === Constants.Commands.UPLOAD_DATA_FILE ){
										console.log('result: ', result );
										if( result.result == 1 ){
											$.alert( result.message );
			
											return;
										}
		
										if( result.result == 2 ){
											$.alert( 'selected-file-already-in-repository');
										}
		
										let fileInfos = result[term.termName];
			
										for( let fileName in fileInfos){
											let fileInfo = fileInfos[fileName];
											term.refreshFile( fileInfo.parentFolderId, 
																fileInfo.fileId,
																fileInfo.name,
																fileInfo.size,
																fileInfo.type );
										}
									}
									else if( cmd === Constants.Commands.DELETE_DATA_FILE ){
										term.removeFile( result.fileName );
										if( dataStructure.inputStatusDisplay ){
											dataStructure.displayInputStatus();
										}
									}
		
									dataStructure.fireStructuredDataChangedEvent();
								},
								error: function( errorMsg ){
									$.alert( errorMsg );
								},
								complete: function(){
								}
							});

							break;
						}
						case TermTypes.MATRIX:{
							let row = packet.row;
							let column = packet.column;

							if( isNaN(Number(packet.value)) ){
								$.alert( 'Matrix can take only numbers: ' + packet.value );
								packet.$source.val( term.getCell(row, column) );
								return;
							}

							term.setCell( packet.row, packet.column, Util.toSafeNumber( packet.value ) );

							if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
								dataStructure.propertyForm.value = term.hasValue() ? 
												JSON.stringify(term.value) : '';
							}

							dataStructure.fireStructuredDataChangedEvent();

							break;
						}
						case TermTypes.DATE:{
							term.value = packet.value;

							if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
								dataStructure.propertyForm.value = term.enableTime ? 
										term.toDateTimeString() : term.toDateString();
							}

							dataStructure.fireStructuredDataChangedEvent();
							break;
						}
						case TermTypes.EMAIL:{
							if( packet.attribute === 'emailId' ){
								term.emailId = packet.value;
							}
							else if( packet.attribute === 'server' ){
								term.server = packet.value;
							}

							if( dataStructure.forWhat === Constants.FOR_PREVIEW && term.hasValue() ){
								dataStructure.propertyForm.value = term.value;
							}

							dataStructure.fireStructuredDataChangedEvent();
							break;
						}
						case TermTypes.PHONE:{
							switch( packet.attribute ){
								case 'mobileNo':{
									term.mobileNo = packet.value;
									break;
								}
								case 'stationNo':{
									term.stationNo = packet.value;
									break;
								}
								case 'personalNo':{
									term.personalNo = packet.value;
									break;
								}
							}

							if( dataStructure.forWhat === Constants.FOR_PREVIEW && term.hasValue() ){
								dataStructure.propertyForm.value = term.value;
							}

							dataStructure.fireStructuredDataChangedEvent();
							break;
						}
						case TermTypes.ADDRESS:
							if( packet.attribute === 'zipcode' ){
								term.zipcode = packet.zipcode;
								term.street = packet.street;
							}
							else if( packet.attribute === 'detailAddr' ){
								term.detailAddr = packet.value;
							}

							if( dataStructure.forWhat === Constants.FOR_PREVIEW && term.hasValue() ){
								dataStructure.propertyForm.value = term.value;
							}

							console.log('Address: ', term);

							dataStructure.fireStructuredDataChangedEvent();
							break;
						default:
							if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
								dataStructure.propertyForm.value = term.value;
							}

							dataStructure.fireStructuredDataChangedEvent();
							break;
					}
				}

				if( dataStructure.inputStatusDisplay ){
					dataStructure.displayInputStatus();
				}
			});

		}

		configureGoToOptions(){
			if( !Array.isArray(this.#terms) || this.#terms.length === 0 ){
				return;
			}

			if( !this.goTo ){
				this.$goToBar.hide();
				return
			}

			this.$goToBar.show();

			this.refreshGoTo();

			this.setGoToCategory();
		}

		getAvailableGoToTerm( val ){
			let category = this.$goToCategory.val();
			
			return ( category === 'termName' ) ?
						this.#availableTermNames[val] : 
						this.#availableDisplayNames[val];
		}

		setGoToCategory(){
			let category = FormUIUtil.getFormValue('goToCategory');
			let source = (category === 'termName') ? Object.keys(this.#availableTermNames) :
													 Object.keys(this.#availableDisplayNames);
			
			let self = this;
			this.$goToSelector.autocomplete({
				source: source,
				select: function( event, ui ){
					self.$goToSelector.val(ui.item.value);
					self.$goToSelector.trigger('change');
				}
			});
		}

		refreshGoTo(){
			if( !this.goTo )	return;

			this.#availableDisplayNames = new Object();
			this.#availableTermNames = new Object();

			this.#terms.forEach(term=>{
				if( term.isGroupTerm() ||
					!term.searchable ){
					return;
				}

				this.#availableDisplayNames[term.getLocalizedDisplayName()] = term;
				this.#availableTermNames[term.termName] = term;
			});
		}

		fireStructuredDataChangedEvent(){
			let dataPacket = new EventDataPacket( NAMESPACE, NAMESPACE );
			dataPacket.payloadType = Constants.PayloadType.DB_CONTENT;
			dataPacket.payload = {
				dataTypeId: this.dataTypeId,
				structuredDataId: this.structuredDataId,
				content: this.toDBContent()
			};

			//console.log( 'fireStructuredDataChangedEvent: ', dataPacket.payload );
			Util.fire( Events.SX_STRUCTURED_DATA_CHANGED, dataPacket );
		}
		
		/***********************************************************************
		 *  Term Property Handling Functions
		 ***********************************************************************/
		setPropertyFormValues(){
			let term = this.currentTerm;

			this.propertyForm.termType = term.termType;
			this.propertyForm.termName = term.termName;
			this.propertyForm.termVersion = term.termVersion;
			this.propertyForm.termDisplayName = term.displayName;
			this.propertyForm.termDefinition = term.definition;
			this.propertyForm.termTooltip = term.tooltip;
			this.propertyForm.mandatory = term.mandatory;
			this.propertyForm.abstractKey = term.abstractKey;
			this.propertyForm.disabled = term.disabled;
			this.propertyForm.searchable = term.searchable;
			this.propertyForm.downloadable = term.downloadable;
			this.propertyForm.synonyms = term.synonyms;
			this.propertyForm.cssWidth = term.cssWidth;
			if( term.hasValue() ){
				this.propertyForm.value = term.value;
			}
			
			switch( term.termType ){
				case TermTypes.STRING:
					this.propertyForm.placeHolder = term.placeHolder;
					this.propertyForm.minLength = term.minLength;
					this.propertyForm.maxLength = term.maxLength;
					this.propertyForm.multipleLine = term.multipleLine;
					this.propertyForm.validationRule = term.validationRule;
					this.propertyForm.inputSize = term.inputSize;
					this.propertyForm.lineBreak = term.lineBreak;
					break;
				case TermTypes.NUMERIC:
					this.propertyForm.numericPlaceHolder = term.placeHolder;
					this.propertyForm.minValue = term.minValue;
					this.propertyForm.minBoundary = term.minBoundary;
					this.propertyForm.maxValue = term.maxValue;
					this.propertyForm.maxBoundary = term.maxBoundary;
					this.propertyForm.uncertainty = term.uncertainty;
					this.propertyForm.unit = term.unit;
					this.propertyForm.sweepable = term.sweepable;
					this.propertyForm.inputSize = term.inputSize;
					this.propertyForm.lineBreak = term.lineBreak;
					break;
				case TermTypes.LIST:
					this.propertyForm.placeHolder = term.placeHolder;
					this.propertyForm.displayStyle = term.displayStyle;
					this.propertyForm.multiple = term.multiple;
					this.propertyForm.listOptions = term.options;
					break;
				case TermTypes.BOOLEAN:
					this.propertyForm.placeHolder = term.placeHolder;
					this.propertyForm.booleanDisplayStyle = term.displayStyle;
					this.propertyForm.trueLabel = term.trueOptionLabel;
					this.propertyForm.falseLabel = term.falseOptionLabel;

					break;
				case TermTypes.MATRIX:
					this.propertyForm.rows = term.rows;
					this.propertyForm.columns = term.columns;
					this.propertyForm.columnWidth = term.columnWidth;
					break;
				case TermTypes.DATE:
					this.propertyForm.enableTime = term.enableTime;
					this.propertyForm.startYear = term.startYear;
					this.propertyForm.endYear = term.endYear;
					break;
				case TermTypes.FILE:
					break;
				case TermTypes.ADDRESS:
					break;
				case TermTypes.EMAIL:
					break;
				case TermTypes.PHONE:
					break;
				case TermTypes.GROUP:
					this.propertyForm.expanded = term.expanded;
					break;
			}
		}

		/**
		 * Coloring a terms's label
		 * 
		 * @param {Term} term 
		 * @returns 
		 */
		paintTermHeader( term ){
			if( !term || !term.isRendered() )	return;
			let css= new Object();

			if(term.isGroupTerm() ){
				let active = (term.$accordion.accordion('option', 'active') === 0) ? true : false;

				if( this.inputStatusDisplay ){
					if( active ){
						css.color = term.inputFull ? Term.GROUP_ACTIVE_COLOR : Term.GROUP_ACTIVE_FULL_COLOR;
					}
					else{
						css.color = term.inputFull ? Term.GROUP_INACTIVE_COLOR : Term.GROUP_INACTIVE_FULL_COLOR;
					}
				}
				else{
					css.color = active ? Term.ACTIVE_COLOR : Term.INACTIVE_COLOR;
				}

				term.$header.css(css);
			}
			else{
				if( this.inputStatusDisplay ){
					css.color = term.hasValue() ? Term.TERM_LABEL_COLOR : Term.TERM_LABEL_FULL_COLOR;
				}
				else{
					css.color = Term.TERM_LABEL_COLOR;
				}

				term.$label.css( css );
			}

			if( term.isMemberOfGroup() ){
				this.paintTermHeader( this.getTerm(term.groupId) );
			}
		}


		setCurrentTerm( term, fromClick=true ){
			if( this.currentTerm === term ){
				if( term.isGroupTerm() ){
					if( this.forWhat !== Constants.FOR_SEARCH ){
						this.paintTermHeader( term );
					}
				}
			}
			else{ 
				let prevTerm = this.currentTerm;
				this.currentTerm = term;
				
				if( term.isGroupTerm() ){
					if( fromClick ){
						this.collapseOtherGroups( term, true );
						if( this.forWhat !== Constants.FOR_SEARCH ){
							this.paintTermHeader( term );
						}
					}
					else{
						this.expandGroup( term, true, true );
					}
				}
				else{
					if( term.isMemberOfGroup() ){
						this.expandGroup( this.getTerm(term.groupId), true, true );
					}
					else if( term.isColumn() ){
						let gridTerm = term.gridTerm;
						this.expandGroup( this.getTerm(gridTerm.groupId), true, true );
					}
					else{
						this.collapseOtherGroups( term, true );
					}
				}

				if( this.forWhat !== Constants.FOR_SEARCH && !!prevTerm ){
					this.paintTermHeader( prevTerm );
				}

				if( this.forWhat === Constants.FOR_PREVIEW ){
					this.replaceVisibleTypeSpecificSection( this.currentTerm.termType );
					
					//this.clearHighlight();
					if( this.currentTerm.isRendered() ){
						this.propertyForm.disableRenderedBtnGroup(true);
						this.propertyForm.disableMoveBtnGroup(false);
					}
					else{
						this.propertyForm.disableRenderedBtnGroup(false);
						this.propertyForm.disableMoveBtnGroup(true);
					}
					
					if( this.currentTerm.isGroupTerm() ){
						this.propertyForm.disableGroupPropertyGroup( true );
					}
					else{
						this.propertyForm.disableGroupPropertyGroup( false );
					}
					
				}
				
				this.highlightTerm( this.currentTerm, true );
			}
		}

		replaceVisibleTypeSpecificSection( termType ){
			// FormUIUtil.replaceVisibleTypeSpecificSection( termType );
			let $termTypeSpecificSection = $('#' + NAMESPACE + 'typeSpecificSection');

			let param = {};
			param[NAMESPACE+'termType'] = termType;

			let dataStructure = this;
			$.ajax({
				url: this.termTypeRenderURL,
				method: 'post',
				data: param,
				dataTYpe: 'html',
				success: function( html ){
					$termTypeSpecificSection.empty();
					$termTypeSpecificSection.html(html);
					dataStructure.propertyForm.attachFormConrolEvents( termType );
					dataStructure.setPropertyFormValues();
				},
				error: function(err){
					console.log('error: ', err);
				}
			});

		}

		/**
		 * Disable or enable form controls
		 * 
		 * @param {['string']} controlIds 
		 * @param {'booelan'} disable 
		 */
		disable( controlIds, disable=true ){
			controlIds.forEach( $ctrl => {
				$ctrl = disable;
			});
		}

		

		/*****************************************************************
		 * APIs for DataStructure instance
		 *****************************************************************/
		
		/**
		 * Loads data from a source.
		 * Source can be one of JSON object, file content, url
		 * 
		 * @param {Object} srcData 
		 * @param {string} srcType 
		 */
		loadData( srcData, srcType ){
			if( !this.terms || !srcData )	return;

			switch( srcType ){
				case 'JSON':{
					//The data being loaded is json object, which is usually read from DB

					this.terms.forEach( term => {
						let termData = srcData[term.termName];
						if( Util.isEmpty(termData) ){
							term.value = undefined;
							return;
						}

						switch( term.termType ){
							case TermTypes.LIST:
							case TermTypes.NUMERIC:
							case TermTypes.BOOLEAN:
							case TermTypes.DATE:
							case TermTypes.MATRIX:
							case TermTypes.FILE:
							case TermTypes.STRING:
							case TermTypes.GRID:{
								term.value = termData;
								break;
							}
							case TermTypes.ADDRESS:{
								term.value = termData;
								break;
							}
							case TermTypes.EMAIL:{
								term.value = termData;
								break;
							}
							case TermTypes.PHONE:{
								term.value = termData;
								break;
							}
						}
					});
					break;
				}
				case 'FILE_CONTENT':{

					break;
				}
				case 'URL':{
					let params = Liferay.Util.ns( NAMESPACE, paramData);
					
					let dataStructure = this;
					$.ajax({
						url: url,
						method: 'post',
						data: params,
						dataType: 'json',
						success: function( dataStructure ){
							dataStructure.parse( dataStruture );
						},
						error: function( data, e ){
							console.log(data);
							console.log('AJAX ERROR-->' + e);
						}
					});

					break;
				}
			}
		}
		
		createTerm( termType, jsonObj ){
			let term;
			
			switch( termType ){
			case 'String':
				term = new StringTerm(jsonObj);
				break;
			case 'Numeric':
				term = new NumericTerm(jsonObj);
				break;
			case 'Integer':
				term = new IntegerTerm(jsonObj);
				break;
			case 'List':
				term = new ListTerm(jsonObj);
				break;
			case 'Boolean':
				term = new BooleanTerm(jsonObj);
				break;
			case 'EMail':
				term = new EMailTerm(jsonObj);
				break;
			case 'Date':
				term = new DateTerm(jsonObj);
				break;
			case 'Address':
				term = new AddressTerm(jsonObj);
				break;
			case 'Phone':
				term = new PhoneTerm(jsonObj);
				break;
			case 'Matrix':
				term = new MatrixTerm(jsonObj);
				break;
			case 'File':
				term = new FileTerm(jsonObj);
				break;
			case 'Group':
				term = new GroupTerm(jsonObj);
				break;
			case 'Grid':
				term = new GridTerm(jsonObj);
				break;
			default:
				term = new StringTerm(jsonObj);
			}

			return term;
		}

		copyTerm( term, parentTermId ){
			let copied = term.clone();

			let namePostfix = '_copied';

			copied.termName = term.termName + namePostfix;

			while( this.exist( copied.termName ) ){
				copied.termName = copied.termName + namePostfix;
			}

			if( term.termType === TermTypes.GRID ){
				let columns = copied.columnDefs;
				for( let colName in columns ){
					let column = columns[colName];
					while( this.exist( column.termName ) ){
						copied.replaceColumnName( column.termName, column.termName + namePostfix );
						//column.termName = column.termName + namePostfix;
					}
				};
			}

			copied.termVersion = '1.0.0';
			if( parentTermId ) copied.groupTermId = parentTermId;
			copied.order = 0;
			
			copied.$rendered = undefined;

			this.addTerm( copied, 0 );
			this.$renderTerm( copied );

			let self = this;
			if( copied.isGroupTerm() ){
				let groupMembers = this.getGroupMembers( term.termId );
				
				groupMembers.forEach( member => {
					self.copyTerm( member, copied.termId );
				});
			}
			else if( copied.termType === TermTypes.GRID ){

			}
			
			if( this.inputStatusDisplay ){
				this.displayInputStatus();
			}
			if( this.goTo ){
				this.refreshGoTo();
			}

			return copied;
		}
		
		/**
		 * Get Term instance indicated by term name of the data structure.
		 * The returned Term instance could be a child of any Group or not.
		 * 
		 * @param {TermId} termId 
		 * @returns 
		 * 		Term: Just argument object if termName is an object instance,
		 *            null when termName is empty string or there is no matched term,
		 *            otherwise searched term.
		 */
		getTerm( termId ){
			if( termId.isEmpty() ){
				return null;
			}
			
			let searchedTerm = null;
			this.terms.every( term => {
				if( termId.sameWith( term.termId ) ){
					searchedTerm = term;
					return Constants.STOP_EVERY;
				}

				return Constants.CONTINUE_EVERY;
			});

			return searchedTerm;
		}

		/**
		 * Get the first term of which name is termname.
		 * 
		 * @param {String} termName 
		 * @returns 
		 * 		Term instance.
		 */
		getTermByName( termName ){
			let searchedTerm = null;
			this.terms.every( term => {
				if( term.termName === termName ){
					searchedTerm = term;
					return Constants.STOP_EVERY;
				}

				return Constants.CONTINUE_EVERY;
			});

			return searchedTerm;
		}

		/**
		 * Get every terms of which names are termname.
		 * 
		 * @param {String} termName 
		 * @returns
		 * 		Array of Terms.
		 */
		getTermsByName( termName ){
			let terms = this.terms.filter(term=>term.termName===termName);
			return terms;
		}

		/**************************************************************
		 * APIs related with GroupTerm
		 **************************************************************/

		/**
		 * Gets group term object if term is a member of a group. 
		 * Otherwise returns null object.
		 * 
		 * @param {Term} term 
		 * @returns 
		 */
		getGroupTerm( term ){
			if( !this.terms ){
				return null;
			}

			let groupTermId = term.groupTermId;
			return groupTermId.isEmpty() ? 
						null : 
						this.getTerm(groupTermId);
		}

		getTopLevelTermId(){
			return new TermId();
		}
		
		/**
		 * Gets terms which are members of a group.
		 * If groupTermId is one of null, undefined, or empty TermId instance, then
		 * the fuinction returns top level members.
		 * 
		 * @param {TermId} groupTermId 
		 * @returns
		 * 	{Array} array of Terms.
		 */
		getGroupMembers( groupTermId ){
			if( !Util.isNonEmptyArray(this.terms) ){
				return [];
			}

			if( !groupTermId ){
				groupTermId = this.getTopLevelTermId();
			}

			let members = this.terms.filter( term => {
				if( groupTermId.isEmpty() && !term.isMemberOfGroup() ){
					return Constants.FILTER_ADD;
				}
				else if( term.isMemberOfGroup() && 
						 groupTermId.isNotEmpty() &&
						 groupTermId.sameWith(term.groupTermId) ){
					return Constants.FILTER_ADD;
				}
				else{
					return Constants.FILTER_SKIP;
				};
			});

			if( members.length > 1 ){
				members.sort( (termA, termB)=>{
					return termA.order - termB.order;
				});
			}

			return members;
		}

		/**
		 * Get term by order
		 * 
		 * @param {TermId} groupTermId
		 * @param {integer} order, which should be larger than 0 and less than count of members
		 * @returns 
		 */
		getTermByOrder( groupTermId, order ){
			let searchedTerm = null;

			let children = this.getGroupMembers(groupTermId);

			if( children.length === 0 ||
				order <= 0 || 
				order > this.terms.length ){
				
				return null;
			}

			children.every(child=>{
				if( child.order === order ){
					searchedTerm = child;
					return Constants.STOP_EVERY;
				}

				return Constants.CONTINUE_EVERY;
			});

			return searchedTerm;
		}

		moveUpTerm( term ){
			if( term.order <= 1 ){
				return;
			}

			let switchedTerm = this.getTermByOrder( term.groupTermId, term.order-1 );
			switchedTerm.order++;
			term.order--;

			let $panel = this.$getPreviewPanel( term.groupId );

			if( term.order === 1 ){
				$panel.prepend(term.$rendered); 
			}
			else{
				$panel.children( '.sx-form-item-group:nth-child('+term.order+')' ).before( term.$rendered );
			}
		}

		moveDownTerm( term ){
			let maxOrder = this.countGroupMembers( term.groupTermId );
			if( term.order >= maxOrder ){
				return;
			}

			let switchedTerm = this.getTermByOrder( term.groupTermId, term.order+1 );
			switchedTerm.order--;
			term.order++;

			let $panel = this.$getPreviewPanel( term.groupId );

			if( switchedTerm.order === 1 ){
				$panel.prepend(switchedTerm.$rendered); 
			}
			else{
				$panel.children( '.sx-form-item-group:nth-child('+switchedTerm.order+')' ).before( switchedTerm.$rendered );
			}
		}

		setGroupIncrementalOrder( term ){
			let terms = this.getGroupMembers( term.groupTermId );
			term.order = terms.length;
		}

		/**
		 * 
		 * @param {Term or string} groupName 
		 * @returns 
		 */
		refreshGroupMemberOrders( groupTermId ){
			let terms = this.getGroupMembers( groupTermId );

			let self = this;
			terms = terms.map( (term, index) => {
				term.order = index+1;

				if( term.isGroupTerm() ){
					self.refreshGroupMemberOrders( term.termId );
				}

				return term;
			});

			return terms;
		}

		/**
		 * Moves children of the oldGroup to newGroup.
		 * As a result, oldGroup will have no child.
		 * Notice that this function does not remove terms form
		 * the data structure.
		 * 
		 * @param {TermId} oldGroupTermId 
		 * @param {TermId} newGroupTermId 
		 */
		moveGroupMembers( oldGroupTermId, newGroupTermId ){
			let oldMembers = this.getGroupMembers( oldGroupTermId );

			let self = this;
			oldMembers.forEach(member=>self.addGroupMember(member, newGroupTermId));
		}

		/**
		 * 
		 */
		chooseGroupTerms( groupTerm ){
			if( !this.terms || this.terms.length === 0 ){
				return null;
			}

			let self = this;

			// Creates dialog content
			let $groupTermsSelector = $('<div>');
			this.terms.forEach((term, index)=>{
				if( groupTerm === term || 
					(term.isMemberOfGroup() && 
						!term.groupId.sameWith(groupTerm.termId)) ){
					return;
				}

				let selected;
				if( groupTerm.isRendered() ){
					selected = term.groupId.sameWith( groupTerm.termId );
				}
				else{
					selected = groupTerm.tempMembers.includes( term );
				}

				$groupTermsSelector.append( FormUIUtil.$getCheckboxTag( 
					NAMESPACE+'_term_'+(index+1),
					NAMESPACE+'groupTermsSelector',
					term.displayName.getText(CURRENT_LANGUAGE),
					selected,
					term.termName,
					false,
					{} ) );
			});

			$groupTermsSelector.dialog({
				title: 'Check Group Terms',
				autoOpen: true,
				dragglable: true,
				modal: true,
				buttons:[
					{
						text: 'Confirm', 
						click: function(){
							let termNameSet = FormUIUtil.getFormCheckedArray('groupTermsSelector');
							// there could be rendered children.
							let oldMembers = self.getGroupMembers(groupTerm.termId);
							oldMembers = oldMembers.filter( member=>{
								if( !termNameSet.includes(member.termName) ){
									self.addGroupMember( member, groupTerm.groupTermId, false);
									return Constants.FILTER_SKIP;
								}

								return Constants.FILTER_ADD;
							});

							termNameSet.forEach(termName=>{
								let term = self.getTermByName( termName );
								if( oldMembers.includes(term) ){
									return;
								}

								if( groupTerm.isRendered() ){
									self.addGroupMember( term, groupTerm.termId, false );
									//groupTerm.$groupPanel.append(term.$rendered);
								}
								else{
									groupTerm.tempMembers.push( term );
								}
							});

							self.refreshGroupMemberOrders( self.getTopLevelTermId() );

							$(this).dialog('destroy');
						}
					},
					{
						text: 'Cancel',
						click: function(){
							$(this).dialog('destroy');
						}
					}
				]
			});
		}

		/**
		 * Select terms as columns of a grid.
		 * 
		 * @param {GridTerm} gridTerm 
		 * @returns 
		 */
		selectGridColumns( gridTerm ){
			let availTerms = this.terms.filter( term => 
					(term.groupId.sameWith(gridTerm.groupId) && 
					!term.isGroupTerm() &&
					term.termType !== TermTypes.GRID &&
					term.termType !== TermTypes.MATRIX &&
					term.termType !== TermTypes.FILE ) );

			let curTerms = gridTerm.columnDefsArray;

			let allAvailTerms = availTerms.concat( curTerms );
			
			if( allAvailTerms.length === 0 ){
				return;
			}

			let dataStructure = this;

			// Creates dialog content
			let controlName = NAMESPACE + gridTerm.termName + '_column';
			let $columnSelector = $('<div>');
			allAvailTerms.forEach(term=>{
				let selected = gridTerm.hasColumn( term.termName );

				$columnSelector.append( FormUIUtil.$getCheckboxTag( 
					controlName+'_'+term.termName,
					controlName,
					term.displayName.getText(CURRENT_LANGUAGE),
					selected,
					term.termName,
					false,
					{} ) );
			});

			$columnSelector.dialog({
				title: Liferay.Language.get('select-grid-columns'),
				autoOpen: true,
				dragglable: true,
				modal: true,
				buttons:[
					{
						text: Liferay.Language.get('ok'), 
						click: function(){
							let selectedColumnNames = FormUIUtil.getFormCheckedArray(gridTerm.termName+'_column');
							// there could be rendered children.
							let oldColumns = gridTerm.columnDefs;
							for( let colName in oldColumns ){
								if( !selectedColumnNames.includes(colName) ){
									let removedTerm = gridTerm.removeColumn( colName );
									if( removedTerm ){
										removedTerm.groupTermId = gridTerm.groupId;
										dataStructure.addTerm( removedTerm );
										dataStructure.$renderTerm( removedTerm );
										//dataStructure.refreshTerm(removedTerm); 
									}
								}
							};

							//Precluded column definiotions are returned to as group members,
							// which is the grid term included.
							selectedColumnNames.forEach( colName => {
								if( !gridTerm.hasColumn( colName ) ){
									let term = dataStructure.removeTerm( colName );
									term.order = undefined;
									gridTerm.addColumn( term );
								}
							});

							if( gridTerm.isRendered() ){
								dataStructure.refreshTerm( gridTerm )
							}

							$(this).dialog('destroy');
						}
					},
					{
						text: 'Cancel',
						click: function(){
							$(this).dialog('destroy');
						}
					}
				]
			});
		}

		/**
		 * 
		 * @param {Term} term 
		 * @param {TermId} newGroupTermId 
		 * @param {boolean} render 
		 * @returns 
		 */
		addGroupMember( term, newGroupTermId, render=false ){
			term.groupTermId = newGroupTermId;

			this.setGroupIncrementalOrder( term );
			
			
			let $rendered = term.$rendered;
			if( render === true ){
				$rendered = this.$renderTerm( term, Constants.FOR_PREVIEW );
			}

			this.$getPreviewPanel( newGroupTermId ).append( $rendered );

			return term;
		}

		$getPreviewPanel( groupTermId ){
			let groupTerm = this.getTerm( groupTermId );

			return groupTerm === null ? 
						this.$canvas : 
						groupTerm.$groupPanel;
		}

		/********************************************************
		 *  APIs related with ListTerm
		 ********************************************************/

		chooseSlaveTerms( targetTerm, targetOption ){
			if( !this.terms || this.terms.length === 0 ){
				return null;
			}

			let availableTerms = this.getGroupMembers( targetTerm.groupId );
			availableTerms = availableTerms.filter( term => term !== targetTerm );
									 
			let $slaveTermsSelector = $('<div>');
			availableTerms.forEach((term, index)=>{
				if( term === targetTerm ){
					return;
				}

				let selected = targetOption.slaveTerms ? 
										targetOption.slaveTerms.includes(term.termName) : false;
				let disabled = false;

				// Check the term is already specified as an active term from other options or other terms.
				// On that case, the checkbox for the term should be disabled.
				if( term.masterTerm &&
					term.masterTerm !== targetTerm.termName ){
					disabled = true;
				}
				
				targetTerm.options.every((option)=>{
					if( option !== targetOption && 
						option.slaveTerms && 
						option.slaveTerms.includes( term.termName ) ){
						disabled = true;

						return Constants.STOP_EVERY;
					}

					return Constants.CONTINUE_EVERY;
				});
				
				$slaveTermsSelector.append( FormUIUtil.$getCheckboxTag( 
											NAMESPACE+'_term_'+(index+1),
											NAMESPACE+'slaveTermsSelector',
											term.displayName.getText(CURRENT_LANGUAGE),
											selected,
											term.termName,
											disabled ) );
			});

			let self = this;
			$slaveTermsSelector.dialog({
				title: 'Check Slave Terms',
				autoOpen: true,
				dragglable: true,
				modal: true,
				close: function(event, ui){
					$(this).dialog('destroy');
				},
				buttons:[
					{
						text: 'Confirm', 
						click: function(){
							if( Util.isNotEmpty(targetOption.slaveTerms) ){
								targetOption.slaveTerms.forEach( termName => {
									let term = self.getTermByName( termName );
									term.masterTerm = undefined;
								});
								targetOption.slaveTerms = undefined;
							}

							let selectedTerms = FormUIUtil.getFormCheckedArray('slaveTermsSelector');
							if( selectedTerms.length > 0 ){
								targetOption.slaveTerms = selectedTerms;
								targetOption.slaveTerms.forEach( termName => {
									let term = self.getTermByName( termName );
									term.masterTerm = targetTerm.termName;
								});
							}

							console.log('Slave Terms: ', targetTerm );

							self.activateSlaveTerms( targetTerm );

							$(this).dialog('destroy');
						}
					},
					{
						text: 'Cancel',
						click: function(){
							$(this).dialog('destroy');
						}
					}
				]
			});
		}

		activateTerm( termName, active=Term.STATE_ACTIVE ){
			this.getTermByName( termName ).activate( active );
		}

		/**
		 * Gets all slave terms of ListTerm or BooleanTerm
		 * 
		 * @param {String} masterTermName 
		 * @returns Array of slave term names
		 */
		getAllSlaveTerms( masterTermName ){
			let masterTerm = this.getTermByName( masterTermName );
			if( !(masterTerm.termType === TermTypes.LIST ||
				  masterTerm.termType === TermTypes.BOOLEAN) ){
				return new Array();
			}

			return masterTerm.getAllSlaveTerms();
		}

		activateSlaveTerms( listTerm ){
			let options = listTerm.options;

			let values = new Array();
			if( listTerm.hasValue() ){
				if( Array.isArray(listTerm.value) ){
					values = listTerm.value;
				}
				else{
					values = [listTerm.value];
				}
			}

			let dataStructure = this;

			options.forEach( option => {
				if( values.includes( option.value ) ){
					if( option.slaveTerms ){
						let slaveTermNames = option.slaveTerms;
						slaveTermNames.forEach( termName => dataStructure.activateTerm( termName, Term.STATE_ACTIVE ) );
					}
					/*
					else{
						if( dataStructure.forWhat === Constants.FOR_PREVIEW ){
							let slaveTerms = dataStructure.getAllSlaveTerms( listTerm.termName );
							slaveTerms.forEach( term => term.$rendered.show() );
							
							allSlavesActivated = true;
						}
					}
					*/
				}
				else{ // all slave term are deactivated.
					if( option.slaveTerms ){
						let slaveTermNames = option.slaveTerms;
						slaveTermNames.forEach( termName => dataStructure.activateTerm( termName, Term.STATE_INACTIVE ) );
					}
				}
			});

			this.displayInputStatus();
		}
		
		/*******************************************************************
		 * Add a term to the data structure. The order of the term is set
		 * based on baseOrder. 
		 *  
		 * @param {Term} term 
		 * @param {int} baseOrder 
		 * @returns 
		 ********************************************************************/
		addTerm( term, baseOrder=0 ){
			this.setTermOrder( term, baseOrder );

			if( this.isEmptyTerms() ){
				this.terms = new Array();
			}

			this.#terms.push( term );

			return true;
		}

		/**
		 * Assign an order for a term.
		 * 
		 * @param {Term} term 
		 * @param {integer} baseOrder 
		 * @returns 
		 */
		setTermOrder( term, baseOrder=0 ){
			let groupTermId = term.isMemberOfGroup() ? 
								term.groupId : this.getTopLevelTermId();
			let maxOrder = this.getGroupMembers( groupTermId ).length;

			if( term.order > 0 ){
				let dupTerm = this.getTermByOrder( groupTermId, term.order );
				
				if( !!dupTerm && term != dupTerm ){
					console.log('Term order is duplicated to be initialized: ', term);
					term.order = 0;
				}
			}

			term.order = (term.order > 0) ?
							(term.order + baseOrder) : (maxOrder + baseOrder + 1);

			return term.order;
		}

		sortTermsByOrder( terms, otherTerms ){
			terms.sort(function(t1,t2){ return t1.order - t2.order; });
		}

		moveTermGroupUp( term ){
			let group = this.getTerm( term.groupTermId );
			term.groupTermId = group.groupTermId;

			this.refreshGroupMemberOrders( group.groupTermId );
			//this.refreshGroupMemberOrders( term.groupTermId );
			this.setTermOrder( term, 0);

			if( term.isMemberOfGroup() ){
				this.insertGroupMember( this.getGroupTerm(term), term );
			}
			else{
				let $prevRendered = term.$rendered;
				console.log('before $prevRendered: ', $prevRendered);

				this.$renderTerm( term, true );
				this.configureRenderedGroup(term, this.$canvas);
				this.displayGroupInputStatus(term);
				this.paintTermHeader( term );
				console.log('after $prevRendered: ', $prevRendered);
				$prevRendered.remove();
			}
		}

		/**
		 * Delete a term from the data structure.
		 * If deep is true and the term is a GroupTerm, 
		 * all children of the term are also deleted.
		 * If deep is false and the term is a GroupTerm,
		 * all children of the term are moved to the upper group.
		 * 
		 * @param {Term} targetTerm 
		 * @param {boolean} deep 
		 */
		deleteTerm( targetTerm, deep=false ){
			let targetId = targetTerm.termId;
			let	groupTermId = targetTerm.groupId;
			
			this.terms = this.terms.filter( term => !term.termId.sameWith(targetId) );

			//Take care of children if targetTerm is a group
			if( targetTerm.isGroupTerm() && deep === false ){
				this.moveGroupMembers( targetId, groupTermId );
			}
			else if( targetTerm.isGroupTerm() && deep === true ){
				let members = this.getGroupMembers(targetId);
				
				members.forEach(member=>this.deleteTerm(member, true));
			}
			else if( targetTerm.termType === TermTypes.GRID ){
				let columns = targetTerm.columnDefs;

				for( let colName in columns ){
					let column = columns[colName];
					this.addTerm( column );
					this.$renderTerm( column );
					if( this.inputStatusDisplay ){
						this.displayGroupInputStatus( this.getTerm(column.groupId) );
						this.paintTermHeader( column );
					}
				}
			}

			if( targetTerm.isRendered() ){
				targetTerm.emptyRender();
			}
		}

		/**
		 * Remove term from the data structure and returns the removed term. 
		 * Term orders of the group ara re-ordered.
		 * 
		 * @param {String} termName 
		 * @returns
		 * 		{Term}	removed term;
		 */
		removeTerm( termName ){
			let self = this;

			let removedTerm;
			this.terms = this.terms.filter(term => {
				if( term.termName === termName ){
					removedTerm = term;
					return Constants.FILTER_SKIP;
				}
				return Constants.FILTER_ADD;
			});

			if( removedTerm ){
				if( removedTerm.isRendered() ){
					removedTerm.emptyRender();
				}

				this.refreshGroupMemberOrders(removedTerm.groupId);
			}

			return removedTerm;
		}

		removeSlaveTerm( slaveTerm ){
			let terms = this.getGroupMembers( slaveTerm.groupId );
			let master = this.getTermByName( slaveTerm.masterTerm );
			if( master ){
				master.removeSlaveTerm( slaveTerm.termName );
			}

			slaveTerm.masterTerm = undefined;
		}

		isEmptyTerms(){
			return !this.terms || this.terms.length < 1;
		}
		
		exist( termName ){
			if( this.isEmptyTerms() )	return false;
			
			let exist = false;
			this.terms.every( (term) => {
				if( term.termType === TermTypes.GRID ){
					exist = term.hasColumn( termName );
				}
				else{
					exist = term.termName === termName;
				}

				if( exist )	return Constants.STOP_EVERY;
				else		return Constants.CONTINUE_EVERY;
			});
			
			return exist;
		}
		
		countTerms(){
			return this.isEmptyTerms() ? 0 : this.terms.length;
		}

		/**
		 * 
		 * @param {*} abstractKey 
		 * 		If it is true, get the array of terms which are defiened as abstract keyes, 
		 * 		otherwise returns the array of terms which are not defined. 
		 * @returns 
		 */
		getAbstractKeyTerms( abstractKey=true ){
			let abstractKeyTerms = this.terms.filter(
				term =>{
					let definedValue = term.abstractKey ? true : false;
					return definedValue === abstractKey;
				}
			);

			return abstractKeyTerms;
		}

		countAbstractKeyTerms( abstractKey=true ){
			return this.getAbstractKeyTerms( abstractKey ).length;
		}

		getSearchableTerms( searchable=true, includeGroup=false ){
			return this.terms.filter(
				term =>{
					if( term.isGroupTerm() && includeGroup === false ){
						return Constants.FILTER_SKIP;
					}
					else{
						if( term.searchable === searchable ){
							return Constants.FILTER_ADD;
						}
						else{
							return Constants.FILTER_SKIP;
						}
					}
				}
			);
		}

		setSearchable( term, searchable=true ){
			if( term.isGroupTerm() ){
				let children = this.getGroupMembers( term.termId );

				let self = this;
				children.forEach( childTerm => {
					childTerm.searchable = searchable;
					self.setSearchable( childTerm );
				});
			}
			else{
				term.searchable = searchable;
			}
		}

		countSearchableTerms( searchable=true ){
			return this.getSearchableTerms( searchable ).length;
		}

		getDownloadableTerms( downloadable=true ){
			let downloadableTerms = this.terms.filter(
				term =>{
					let definedValue = (term.downloadable === false) ? false : true;
					return definedValue === downloadable;
				}
			);

			return downloadableTerms;
		}

		countDownloadableTerms( downloadable=true ){
			return this.getDownloadableTerms( downloadable ).length;
		}

		isAllChildrenDisabled( groupTerm ){
			let allDisabled = true;

			this.getGroupMembers( groupTerm.termId )
				.every( member => {
					if( !member.disabled ){
						allDisabled = false;
						return Constants.STOP_EVERY;
					}

					return Constants.CONTINUE_EVERY;
				});

			return allDisabled;
		}

		disableGroup( term, down=true ){
			if( term.isGroupTerm() && down ){
				let members = this.getGroupMembers( term.termId );
				let self = this;
				members.forEach( member => {
					member.disabled = term.disabled;
					if(member.isGroupTerm()){
						self.disableGroup( member, down );
					} 
				});
			}
			else{
				if( term.isMemberOfGroup() ){
					let parent = this.getTerm( term.groupId );
					
					parent.disabled = this.isAllChildrenDisabled( parent );
					this.disableGroup( parent, false );
				}
			}
		}
			
		expandGroup( groupTerm, expand=true, deep=true ){
			if( !(groupTerm instanceof GroupTerm) )	return;

			if( groupTerm.isMemberOfGroup() && deep ){
				let parentTerm = this.getTerm( groupTerm.groupId );
	
				this.expandGroup( parentTerm, expand, deep );

			}
			
			let active = (expand || groupTerm.expanded) ? 0 : false;
			if( active === groupTerm.$accordion.accordion('option', 'active') ){
				return;
			}
			//groupTerm.$accordion.accordion('option', 'active', false);
			groupTerm.$accordion.accordion('option', 'active', active);

			if( active === 0 ){
				this.collapseOtherGroups( groupTerm, true );
			}
		}

		collapseOtherGroups( term, onlySibligs=true ){
			let siblings = this.getGroupMembers( term.groupId );

			siblings.forEach( sibling=>{
				if( sibling !== term ){
					this.expandGroup( sibling, false, false );
				}
			});
			
			if( !onlySibligs ){
				if( term.isMemberOfGroup() ){
					this.collapseOtherGroups( this.getTerm( term.groupId ), false );
				}
			}
		}

		/**
		 * Counts all active terms of groupId.
		 * 
		 * @param {TermId} groupId 
		 * @returns {int}
		 */
		countGroupInputItems( groupId ){
			if( !groupId ){
				groupId = this.getTopLevelTermId();
			}

			let members = this.getGroupMembers( groupId );

			let inputCount = 0;
			members.forEach( member => {
				if( member.isActive() ){
					if( member.isGroupTerm() ){
						inputCount += this.countGroupInputItems( member.termId );
					}
					else{
						inputCount++;
					}
				}
			});

			return inputCount;
		}

		displayGroupInputStatus( groupTerm ){
			let groupId = groupTerm instanceof GroupTerm ? groupTerm.termId : this.getTopLevelTermId();
			let $statusBar;

			let members = this.getGroupMembers( groupId );

			let inputItemCount = this.countGroupInputItems( groupId );
			let filledInputCount = 0;
			let self = this;
			members.forEach( member => {
				if( member.isActive() ){
					if( member.isGroupTerm() ){
						filledInputCount += self.displayGroupInputStatus( member );
					}
					else{
						filledInputCount += member.displayInputStatus(this.#inputStatusDisplay);
					}

					self.paintTermHeader( member );
				}
			});
			
			let $status = $( '<span class="input-status" style="margin-left:5px;">');

			if( !groupTerm ){
				$statusBar = $('#'+NAMESPACE+'inputStatusBar');
				if( this.#inputStatusDisplay ){
					$status.text('Input Status: ' + filledInputCount + '/' + inputItemCount + ' (' + (filledInputCount/inputItemCount*100).toFixed(1) +'%)');
				}
			}
			else{
				$statusBar = groupTerm.$rendered.find('.ui-accordion-header').first();
				if( this.#inputStatusDisplay ){
					$status.text(filledInputCount + '/' + inputItemCount + ' (' + (filledInputCount/inputItemCount*100).toFixed(1) +'%)');
				}
			}
			
			let $inputStatus = $statusBar.find('.input-status').first();

			if( $inputStatus.length > 0 ){
				$inputStatus.remove();
			}

			if( this.#inputStatusDisplay ){
				$statusBar.append( $status );
			}
			
			if( groupTerm instanceof GroupTerm ){
				if( this.#inputStatusDisplay ){
					if(filledInputCount !== inputItemCount ){
						groupTerm.inputFull = false;
					}
					else{
						groupTerm.inputFull = true;
					}
				}
			
				groupTerm.displayInputStatus(this.#inputStatusDisplay);	
			}  

			return filledInputCount;
		}

		getFormData(){
			let formData = new FormData();

			formData.append(NAMESPACE+'dataTypeName', dataStructure.dataTypeName);
			formData.append(NAMESPACE+'dataTypeVersion', dataStructure.dataTypeVersion);
			formData.append(NAMESPACE+'structuredDataId', dataStructure.structuredDataId);

			if( !Util.isNonEmptyArray(this.terms) )	return formData;
			
			let dataStructure = this;

			let fileContent = new Object();
			this.terms.forEach( (term) => {
				if( !term.isGroupTerm() ){
					if( term.isActive() && term.hasValue() ){
						if( term.termType === TermTypes.FILE ){

							for( let fileName in term.files ){
								let file = term.files[fileName];

								if( !file.fileId ){
									console.log('File uploaded: ', term.files[file]);
									uploadForm.append(NAMESPACE+term.termName+'[]', term.files[file].file );
								}
							}
					
						}
	
						fileContent[term.termName] = term.value;
					}
				}
			});

			formData.append(NAMESPACE+'data', JSON.stringify( fileContent) );

			return formData;
		}

		toDBContent(){
			if( !Util.isNonEmptyArray(this.terms) )	return '{}';
			
			let dbContent = new Object();
			this.terms.forEach( (term) => {
				if( !term.isGroupTerm() ){
					if( term.isActive() && term.hasValue() ){
						dbContent[term.termName] = term.value;
					}
				}
			});


			return JSON.stringify( dbContent );
		}

		toFile( fileContent ){

		}

		toFileContentLine( key, value ){
			let line = "";
			if( this.termDelimiterPosition === 'end' ){
				line = key + ' ' + this.termValueDelimiter + ' ' + value + ' ' + this.termDelimiter + '\n';
			}
			else{
				line = this.termDelimiter + ' ' + key + ' ' + this.termValueDelimiter + ' ' + value + '\n';
			}

			return line;
		}

		fromFileContent( fileContent ){
			let lineDelimiter = this.termDelimiter ? this.termDelimiter : '\n';

			let lines = fileContent.split( lineDelimiter );
		}

		fromFile( fileContent ){

		}
		
		parse( jsonObj, baseOrder=0 ){
			let self = this;
			
			Object.keys(jsonObj).forEach(key=>{
				switch(key){
					case 'termDelimiter':
					case 'termDelimiterPosition':
					case 'termValueDelimiter':
					case 'matrixBracketType':
					case 'matrixElementDelimiter':
					case 'inputStatusDisplay':
					case 'goTo':
					case 'commentChar':
						self[key] = jsonObj[key];
						break;
					case 'tooltip':
						self.tooltip = new LocalizedObject( jsonObj.tooltip );
						break;
					case 'terms':
						jsonObj.terms.forEach( jsonTerm=>{
							self.addTerm( self.createTerm(jsonTerm.termType, jsonTerm), baseOrder );
						});

						break;
				}
			});
		}
		
		toJSON(){
			let json = new Object();

			if( this.termDelimiter ){
				json.termDelimiter = this.termDelimiter;
			}

			json.termValueDelimiter = this.termValueDelimiter;
			json.termDelimiterPosition = this.termDelimiterPosition;
			json.matrixBracketType = this.matrixBracketType;
			json.matrixElementDelimiter = this.matrixElementDelimiter;
			json.inputStatusDisplay = this.inputStatusDisplay;
			json.goTo = this.goTo;
			 
			if( this.commentChar ){
				json.commentChar = this.commentChar;
			}

			if( this.tooltip && !this.tooltip.isEmpty() ){
				json.tooltip = this.tooltip.localizedMap;
			}

			if( this.terms ){
				json.terms = this.terms.filter( term=> term !== null )
										.map(term=>term.toJSON() );
			}

			console.log( 'dataStructure JSON: ', json);
			return json;
		}


		/********************************************************************
		 * APIs for Preview panel
		 ********************************************************************/

		highlightTerm( term, exclusive=true ){
			if( exclusive === true ){
				this.clearHighlight();
			}

			if( term.isRendered() ){
				term.$rendered.addClass('highlight-border');
				return true;
			}

			return false;
		}

		clearHighlight(){
			if( this.isEmptyTerms() )	return;

			this.terms.forEach(term=>{
				if( term.isRendered() ){
					term.$rendered.removeClass('highlight-border');
				}
			});
		}

		clearTermsDirty(){
			this.dirty = false;

			if( this.isEmptyTerms() )	return;

			this.terms.forEach(term=>{
				term.dirty = false;
			});
		}

		setTermsDirty( dirty=true ){
			if( this.isEmptyTerms() )	return;

			this.terms.forEach(term=>{
				term.setDirty( dirty );
			});
		}

		/**
		 * Render term and attach a panel. If the term is a top level member
		 * it is appended to the data structure's preview panel, otherwise,
		 * it is appended to it's group's panel.
		 * 
		 * This function rerenders even if the previous rendered image already exist.
		 * 
		 * @param {Term} term
		 * @param {boolean} highlight 
		 */
		$renderTerm( term, highlight=false, prefix ){
			if( !term.isGroupTerm() && this.forWhat === Constants.FOR_SEARCH ){
				term.$renderSearchItem();
			}
			else{
				term.$render( this.forWhat, prefix );
			}
			if( !term.isRendered() )	return;

			term.$rendered.off('click').on('click', function( event ){
				event.stopPropagation();
				
				let dataPacket = Util.createEventDataPacket(NAMESPACE, NAMESPACE);
				dataPacket.term = term;
				dataPacket.fromClick = true;
				
				Util.fire( Events.DATATYPE_TERM_SELECTED, dataPacket );
			});

			if( term.isSlave() && this.forWhat !== Constants.FOR_SEARCH ){
				term.$rendered.hide();
			}

			this.insertGroupMember( this.getGroupTerm(term), term );

			if( highlight ){
				this.highlightTerm( term );
			}

			if( this.forWhat !== Constants.FOR_SEARCH &&
				(term.termType === TermTypes.LIST ||
				 term.termType === TermTypes.GRID) ){
				term.multiSelectize();
			}

			return term.$rendered;
		}

		$renderTerm_another( term, highlight=false ){
			if( !term.isGroupTerm() && this.forWhat === Constants.FOR_SEARCH ){
				term.$renderSearchItem();
			}
			else{
				term.$render( this.forWhat );
			}
			if( !term.isRendered() )	return;

			term.$rendered.off('click').on('click', function( event ){
				event.stopPropagation();
				
				let dataPacket = Util.createEventDataPacket(NAMESPACE, NAMESPACE);
				dataPacket.source = '$renderTerm()';
				dataPacket.term = term;
				dataPacket.fromClick = true;
				
				Util.fire( Events.DATATYPE_TERM_SELECTED, dataPacket );
			});

			if( highlight ){
				this.highlightTerm( term );
			}

			if( this.forWhat !== Constants.FOR_SEARCH &&
				(term.termType === TermTypes.LIST ||
				 term.termType === TermTypes.GRID) ){
				term.multiSelectize();
			}

			return term.$rendered;
		}

		/**
		 * Renders dataList to PDF format.
		 * 
		 * @param {Array[JSON]} dataList 
		 */
		renderDataToPDF( title, dataList ){
			let pdfAreaId = NAMESPACE + 'pdfArea';
			let $pdf = $('<div id="' + pdfAreaId + '" class="container" style="width:210mm;overflow:visible;">');

			let $title = $('<div class="row" style="text-align:center;width:100%;margin-bottom:20px;">').appendTo($pdf);
			$title.append( $('<div class="col-md-12"><span style="font-size:1.25rem;font-weight:800;width:100%;">'+title+'</span></div>'));

			let $pdfBody = $('<div class="row" style="text-align:center;width:100%;">').appendTo($pdf);
			let $bodyContent = $('<div class="col-md-12">').appendTo( $pdfBody );
			let $dataTable = $('<table style="width:100%; table-layout:fixed;border: 1px solid grey;">').appendTo($bodyContent);
			let $header = $('<tr>').appendTo($dataTable);
			$header.append('<td style="width:10%;border: 1px solid grey;">'+Liferay.Language.get('order')+'</td>');
			$header.append('<td style="width:15%;border: 1px solid grey;">'+Liferay.Language.get('id')+'</td>');
			$header.append('<td style="border: 1px solid grey;">'+Liferay.Language.get('data')+'</td>');
			
			dataList.forEach( (data, index) => {
				let $row = $('<tr>').appendTo($dataTable);
				$row.append('<td style="width:10%;border: 1px solid grey;">'+(index+1)+'</td>');
				$row.append('<td style="width:15%;border: 1px solid grey;">'+data.structuredDataId+'</td>');
				let formatData = JSON.parse(data.structuredData);
				$row.append('<td style="overflow-wrap:break-word;border: 1px solid grey;"><pre style="text-align:left;white-space: pre-wrap;">'+JSON.stringify(formatData,null,4)+'</pre></td>');
				//this.loadData( JSON.parse(data.structuredData), 'JSON' );
				
				//this.terms.forEach( term => term.renderValueToPDF() );
			});

			return $pdf;
		}

		getTermItemNo( term ){
			if( term.isMemberOfGroup() ){
				let groupTerm = this.getTerm( term.groupId );
				return this.getTermItemNo( groupTerm ) + term.order + '.'; 
			}
			else{
				return term.order + '.';
			}
		}

		/**
		 * 
		 * @returns 
		 */
		renderFormToPDF( $canvas, groupTermId ){
			if( Util.isEmpty( this.terms ) ){
				return;
			}

			let children = this.getGroupMembers( groupTermId );

			let renders = new Array();
			children.forEach( term => {
				let $term = $('<div>');
				let prefix = this.getTermItemNo( term ) + ' ';
					
				term.isMemberOfGroup() ?  $term.css('margin', '5px'): null;
					
				let $label = term.$getLabelNode( this.forWhat, prefix ).appendTo($term);
					
				if( term.termType === TermTypes.LIST ||
					term.termType === TermTypes.BOOLEAN ){
					
					if( term.hasSlaves() ){
						let options = term.options;
						let optSlaves = new Object();
						term.options.forEach( option => {
							if( option.hasSlaves() ){
								let optionLabel = option.getLocalizedLabel(CURRENT_LANGUAGE);
								let slaveTermNames = option.slaveTerms;
								optSlaves[optionLabel] = '';
								slaveTermNames.forEach( termName => {
									let slaveTerm = this.getTermByName( termName );
									optSlaves[optionLabel] += this.getTermItemNo( slaveTerm );
								});
							}
						});

						let $direction = $('<div style="border:1px dotted #dddddd;padding:3px 10px 3px 10px;margin:0 10px 5px 10px;"></div>').appendTo( $term );
						let jumpCases = '';

						for( let optionLabel in optSlaves ){
							jumpCases += Liferay.Language.get('x-go-to-x', [optionLabel, optSlaves[optionLabel]]);
						}
						jumpCases = jumpCases.slice(0, jumpCases.lastIndexOf('<br>'));
						let direction = Liferay.Language.get( 'if-you-choose-x', jumpCases );
						$direction.append(direction);
					}

					term.$getControlNode( Constants.FOR_PDF_FORM ).appendTo( $term );
				}
				else if( term.isGroupTerm() ){
					let $groupContent = $('<div style="border:1px solid #dddddd;padding:5px;margin-top:5px;">').appendTo($term);
					this.renderFormToPDF( $groupContent, term.termId );

					$term.append( $groupContent );
				}
				else{
					term.$getControlNode( Constants.FOR_PDF_FORM ).appendTo( $term );
				}

				renders[term.order] = FormUIUtil.$getEditorRowSection($term).css('width', '100%');
			});

			for( let i=1; i < renders.length; i++ ){
				$canvas.append( renders[i] );
			}
		}

		getRenderedNextOrderTerm( terms, order ){
			let nextOrder;

			for( let i=0; i<terms.length; i++ ){
				if( !terms[i].isRendered() ){
					continue;
				}

				if( !nextOrder && terms[i].order > order ){
					nextOrder = terms[i];
				}
				else if( terms[i].order > order && terms[i].order < nextOrder.order ){
					nextOrder = terms[i];
				}
			}

			return nextOrder;
		}

		countPreviewRows( $panel ){
			return $panel.children('.sx-form-item-group').length;
		}

		countGroupMembers( group=null ){
			return this.getGroupMembers( group ).length;
		}

		displayInputStatus(){
			if( this.forWhat === Constants.FOR_SEARCH )	return;
			this.displayGroupInputStatus( null );
		}

		/**
		 * Render all of terms in the term list 
		 * no matter what those terms alredy have render images
		 * 
		 */
		render(){
			if( $.isEmptyObject( this.terms ) ){
				return;
			}

			this.$canvas.empty();
			
			this.terms.forEach( term => {
				let itemNo;
				if( this.itemNoDisplay ){
					itemNo = this.getTermItemNo( term ) + ' ';
				}

				this.$renderTerm( term, false, itemNo );
			});
			
			this.configureRenderedGroup( null, this.$canvas );
			//this.$canvas.find('select[multiple]').multiSelect();
			
			this.setCurrentTerm( this.terms[0], false );

			if( this.forWhat !== Constants.FOR_SEARCH ){
				this.displayInputStatus();
				this.terms.forEach(term=>{
					if( term.termType === 'List' || term.termType === 'boolean' ){
						if( term.hasSlaves() ){
							this.activateSlaveTerms( term );
						}
					}
				});
			}
		}

		insertPreviewRow( $row, index ){
			if( this.$canvas.children( ':nth-child('+index+')' ).length === 0 ){
				this.$canvas.append($row);
			}
			else{
				this.$canvas.children( ':nth-child('+index+')' ).before( $row );
			}
		}

		/**
		 * Refresh term's render image on the preview panel.
		 * 
		 * @param {Term} targetTerm 
		 */
		refreshTerm( targetTerm, highlight=true ){
			if( targetTerm.isColumn() ){
				this.refreshTerm(targetTerm.gridTerm);
				//targetTerm.gridTerm.setColumnSelected( targetTerm.termName, true );
				if( !this.forWhat === Constants.FOR_SEARCH ){
					targetTerm.gridTerm.multiSelectize();
				}
			}
			else{
				if( !targetTerm.isRendered() ){
					return;
				}
				
				this.$renderTerm( targetTerm, highlight );

				if( targetTerm.isGroupTerm() ){
					this.refreshGroup( targetTerm );
				}

				this.displayInputStatus();
				this.paintTermHeader( targetTerm );
			}

			this.configureRenderedGroup(null, this.$canvas);
		}

		refreshGroup( group ){
			let children = this.getGroupMembers( group.termId );

			children.forEach( child => {
				if( child.isGroupTerm() ){
					this.refreshGroup(child);
				}
				else{
					this.$renderTerm( child );
				}
			});
		}

		/**
		 * Insert the member to the group's accordion panel.
		 * If member's order is duplicated or undefined or 0,
		 * member is appended to the panel.
		 * 
		 * @param {GroupTerm} group 
		 * @param {Term} member 
		 * @returns 
		 */
		insertGroupMember( group, member ){
			let $panel;
			
			if( !group ){
				$panel = this.$canvas;
				member.groupTermId = this.getTopLevelTermId();
			}
			else{
				member.groupTermId = group.termId;
				if( !group.isRendered() )	return;
				$panel = group.$groupPanel;
			}

			this.setTermOrder( member );

			let siblings = this.getSiblings( member );
			let nextTerm = this.getRenderedNextOrderTerm(siblings, member.order);

			if( !nextTerm ){
				$panel.append( member.$rendered );
			}
			else{
				nextTerm.$rendered.before( member.$rendered );
			}
		}

		getSiblings( term ){
			let siblings = this.getGroupMembers( term.groupId );

			return siblings.filter( sibling => sibling !== term );
		}

		/**
		 * Configurating rendered group.
		 * All rendered terms of a rendered group are
		 * attached to the group's accordion panel
		 * 
		 * @param {*} groupTerm 
		 */
		configureRenderedGroup( groupTerm, $canvas ){
			let groupId = !groupTerm ? this.getTopLevelTermId() : groupTerm.termId ;
			let members = this.getGroupMembers( groupId );
			
			let $panel = !groupTerm ? $canvas : groupTerm.$groupPanel;

			let self = this;
			let arrangedTerms = new Array();
			members.forEach( member => {
				if( member.isGroupTerm() ){
					self.configureRenderedGroup( member, $canvas );
				}
				else if( member.termType === TermTypes.LIST ||
						 member.termType === TermTypes.BOOLEAN ){
					if( member.hasSlaves() && member.hasValue() ){
						self.activateSlaveTerms( member );
					}
				}

				let nextTerm = self.getRenderedNextOrderTerm( arrangedTerms, member.order );
				if( !nextTerm ){
					$panel.append( member.$rendered );
				}
				else{
					nextTerm.$rendered.before( member.$rendered  );
				}

				arrangedTerms.push( member );
			});
		}

		addGridColumn( gridTerm, term ){
			this.removeTerm( term );


		}
		
		addTestSet( forWhat, $canvas ){
			this.$canvas = $canvas
			// StringTerm
			let dataStructure = {
				termDelimiter: DataStructure.DEFAULT_TERM_DELIMITER,
				termDelimiterPosition: DataStructure.DEFAULT_TERM_DELIMITER_POSITION,
				termValueDelimiter: DataStructure.DEFAULT_TERM_VALUE_DELIMITER,
				matrixBracketType: DataStructure.DEFAULT_MATRIX_BRACKET_TYPE,
				matrixElementDelimiter: DataStructure.DEFAULT_MATRIX_ELEMENT_DELIMITER,
				commentChar: DataStructure.DEFAULT_COMMENT_CHAR,
				tooltip: {
					en_US: 'Data structure tooltip',
					ko_KR: 'Data structure 도움말'
				},
				terms: [
					{
						termType: TermTypes.FILE,
						termName: 'imageFile',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'X-Ray',
							'ko_KR': '엑스레이'
						},
						definition:{
							'en_US': 'Chest X-ray image',
							'ko_KR': '가슴 엑스레이 사진'
						},
						tooltip:{
							'en_US': 'FileTerm',
							'ko_KR': 'FileTerm'
						},
						mandatory: true,
						synonyms: 'testFile01',
						state: Term.STATE_ACTIVE,
						order: 1
					},
					{
						termType: TermTypes.GROUP,
						termName: 'stringBasedTermGroup',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'String-based Term Group',
							'ko_KR': '문자열기반 용어 그룹'
						},
						definition:{
							'en_US': 'EmailTerm, AddressTerm, PhoneTerm are string-based terms. It means the values are stored as string having proper format.',
							'ko_KR': '이메일, 주소, 전화번호 등은 문자열기반 용어로써, 적절한 형식을 갖춘 문자열로 저장된다.'
						},
						tooltip:{
							'en_US': 'A group of string-based terms',
							'ko_KR': '문자열 기반 용어 그룹'
						},
						mandatory: true,
						state: Term.STATE_ACTIVE,
						order: 2
					},
					{
						termType: TermTypes.STRING,
						termName: 'multipleLineString',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Mltiple Line String Term',
							'ko_KR': '다중라인 문자열 용어'
						},
						definition:{
							'en_US': 'Mltiple Line String Term Definition',
							'ko_KR': '다중라인 문자열 정의'
						},
						tooltip:{
							'en_US': 'Mltiple Line StringTerm',
							'ko_KR': '다중라인 StringTerm'
						},
						mandatory: true,
						placeHolder:{
							'en_US': 'Enter test sting',
							'ko_KR': '시험 문자열입력'
						},
						groupTermId:{
							'name':'stringBasedTermGroup',
							'version':'1.0.0'
						},
						state: Term.STATE_ACTIVE,
						minLength: 1,
						maxLength: 1024,
						multipleLine: true,
						validationRule: '^[\w\s!@#\$%\^\&*\)\(+=._-]*$',
						order: 1
					},
					{
						termType: TermTypes.STRING,
						termName: 'singleLineString',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Single Line String Term',
							'ko_KR': '단일 라인 문자열 용어'
						},
						definition:{
							'en_US': 'Input Single Line String',
							'ko_KR': '단일 라인 문자열 입력'
						},
						tooltip:{
							'en_US': 'Single Line StringTerm',
							'ko_KR': '단일 라인 StringTerm'
						},
						mandatory: true,
						placeHolder:{
							'en_US': 'Enter test sting',
							'ko_KR': '문자열입력'
						},
						groupTermId:{
							'name':'stringBasedTermGroup',
							'version':'1.0.0'
						},
						state: Term.STATE_ACTIVE,
						minLength: 1,
						maxLength: 128,
						validationRule: '^[\w\s!@#\$%\^\&*\)\(+=._-]*$',
						order: 2
					},
					{
						termType: TermTypes.GROUP,
						termName: 'listBasedTermGroup',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'List-based Term Group',
							'ko_KR': '리스트 기반 용어 그룹'
						},
						definition:{
							'en_US': 'ListTerm, BooleanTerm are list-based terms.',
							'ko_KR': 'ListTerm, BooleanTerm은 리스트 기반 용어이다.'
						},
						tooltip:{
							'en_US': 'A Group of list based terms',
							'ko_KR': '리스트 기반 용어 그룹'
						},
						state: Term.STATE_ACTIVE,
						order: 3
					},
					{
						termType: TermTypes.BOOLEAN,
						termName: 'adultcheck',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Adult over 19',
							'ko_KR': '19세 이상 성인'
						},
						definition:{
							'en_US': 'Check if the subject is an adult or not.',
							'ko_KR': '대상자가 성인인지 아닌지를 체크.'
						},
						tooltip:{
							'en_US': 'BooleanTerm with \'radio\' display type',
							'ko_KR': '\'radio\' 디스플레이 타입을 가진 BooleanTerm'
						},
						mandatory: true,
						groupTermId:{
							'name':'listBasedTermGroup',
							'version':'1.0.0'
						},
						state: Term.STATE_ACTIVE,
						value: '',
						displayStyle: 'radio',
						options:[
							{
								labelMap:{
									'en_US': '18+',
									'ko_KR': '18세 이상'
								},
								value:true,
								slaveTerms:[]
							},
							{
								labelMap:{
									'en_US': 'Under 18',
									'ko_KR': '18세 미만'
								},
								value:false,
								slaveTerms:[]
							}
						],
						order: 1
					},
					{
						termType: TermTypes.BOOLEAN,
						termName: 'gender',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Gender',
							'ko_KR': '성별'
						},
						definition:{
							'en_US': 'Check if the subject is male or female.',
							'ko_KR': '대상자의 성별 체크.'
						},
						tooltip:{
							'en_US': 'BooleanTerm with \'select\' display type',
							'ko_KR': '\'select\' 디스플레이 타입을 가진 BooleanTerm'
						},
						mandatory: true,
						groupTermId:{
							'name':'listBasedTermGroup',
							'version':'1.0.0'
						},
						state: Term.STATE_ACTIVE,
						value: '',
						displayStyle: 'select',
						options:[
							{
								labelMap:{
									'en_US': 'Male',
									'ko_KR': '남자'
								},
								value:true
							},
							{
								labelMap:{
									'en_US': 'Female',
									'ko_KR': '여자'
								},
								value:false
							}
						],
						order: 2
					},
					{
						termType: TermTypes.LIST,
						termName: 'smokingStatus',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Smoking Status',
							'ko_KR': '흡연 상태'
						},
						definition:{
							'en_US': 'Smoking Status',
							'ko_KR': '흡연 상태'
						},
						tooltip:{
							'en_US': 'ListTerm with \'select\' display type',
							'ko_KR': '\'select\' 디스플레이 타입을 가진 ListTerm'
						},
						mandatory: true,
						state: Term.STATE_ACTIVE,
						groupTermId:{
							'name':'listBasedTermGroup',
							'version':'1.0.0'
						},
						displayStyle: 'select',
						options:[
							{
								labelMap:{
									'en_US': 'Smoking so far',
									'ko_KR': '지속적 흡연'
								},
								value:'ssf'
							},
							{
								labelMap:{
									'en_US': 'Stopped smoking',
									'ko_KR': '금연 중'
								},
								value:'ss'
							},
							{
								labelMap:{
									'en_US': 'Never smoked',
									'ko_KR': '흡연한 적 없음'
								},
								value:'ns'
							}
						],
						order: 3
					},
					{
						termType: TermTypes.LIST,
						termName: 'drinkingStatus',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Drinking Status',
							'ko_KR': '음주 상태'
						},
						definition:{
							'en_US': 'Drinking Status',
							'ko_KR': '음주 상태'
						},
						tooltip:{
							'en_US': 'ListTerm with \'radio\' display type',
							'ko_KR': '\'radio\' 디스플레이 타입을 가진 ListTerm'
						},
						mandatory: true,
						state: Term.STATE_ACTIVE,
						groupTermId:{
							'name':'listBasedTermGroup',
							'version':'1.0.0'
						},
						displayStyle: 'radio',
						options:[
							{
								labelMap:{
									'en_US': 'Drink so far',
									'ko_KR': '지속적 음주'
								},
								value:'dsf'
							},
							{
								labelMap:{
									'en_US': 'Stpped drinking',
									'ko_KR': '금주'
								},
								value:'sd'
							},
							{
								labelMap:{
									'en_US': 'Never drinked',
									'ko_KR': '음주 경험 없음'
								},
								value:'nd'
							}
						],
						order: 4
					},
					{
						termType: TermTypes.LIST,
						termName: 'illHistory',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'History of illness',
							'ko_KR': '병력'
						},
						definition:{
							'en_US': 'History of illness',
							'ko_KR': '병력'
						},
						tooltip:{
							'en_US': 'ListTerm with \'checkbox\' display type',
							'ko_KR': '\'radio\' 디스플레이 타입을 가진 ListTerm'
						},
						mandatory: true,
						state: Term.STATE_ACTIVE,
						groupTermId:{
							'name':'listBasedTermGroup',
							'version':'1.0.0'
						},
						displayStyle: 'check',
						options:[
							{
								labelMap:{
									'en_US': 'cancer',
									'ko_KR': '암'
								},
								value:'cc'
							},
							{
								labelMap:{
									'en_US': 'Stomach Disease',
									'ko_KR': '위장병'
								},
								value:'sd'
							},
							{
								labelMap:{
									'en_US': 'Heart Disease',
									'ko_KR': '심장병'
								},
								value:'hd'
							}
						],
						order: 5
					},
					{
						termType: TermTypes.GROUP,
						termName: 'dateBasedTermGroup',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Date-based Term Group',
							'ko_KR': '날자 기반 용어 그룹'
						},
						definition:{
							'en_US': 'Date-based term has two kinds such as time enabled or not.',
							'ko_KR': '날자 기반 용어는 시간 활성화된 Date, 시간이 비활성화된 Date 두 종류가 있다.'
						},
						tooltip:{
							'en_US': 'A Group of date based terms',
							'ko_KR': '날자 기반 용어 그룹'
						},
						state: Term.STATE_ACTIVE,
						order: 4
					},
					{
						termType: TermTypes.DATE,
						termName: 'birth',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Birthday',
							'ko_KR': '생년월일'
						},
						definition:{
							'en_US': 'Birthday of the subject',
							'ko_KR': '대상자의 생년원일'
						},
						tooltip:{
							'en_US': 'DateTerm with time disabled',
							'ko_KR': '년월일만 표시하는 DateTerm'
						},
						mandatory: true,
						placeHolder:{
							'en_US': 'Select birthday',
							'ko_KR': '생년월일 선택'
						},
						groupTermId:{
							'name':'dateBasedTermGroup',
							'version':'1.0.0'
						},
						state: Term.STATE_ACTIVE,
						order: 1
					},
					{
						termType: TermTypes.DATE,
						termName: 'treatmentDateTime',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Date and Time of Treatment',
							'ko_KR': '진료일시'
						},
						definition:{
							'en_US': 'Treatment date and time of the subject.',
							'ko_KR': '대상자의 진료일시'
						},
						tooltip:{
							'en_US': 'DateTerm enabling time',
							'ko_KR': '연워일시를 표시하는 DateTerm'
						},
						mandatory: true,
						enableTime: true,
						placeHolder:{
							'en_US': 'Select treatment date and time',
							'ko_KR': '진료일시 선택'
						},
						groupTermId:{
							'name':'dateBasedTermGroup',
							'version':'1.0.0'
						},
						state: Term.STATE_ACTIVE,
						order: 2
					},
					{
						termType: TermTypes.GROUP,
						termName: 'numericBasedTermGroup',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Numeric-based Term Group',
							'ko_KR': '숫자 기반 용어 그룹'
						},
						definition:{
							'en_US': 'There are various variations of the numeric-based term depending on the maximum and minimum values, uncertainty values, and whether sweeps are possible.',
							'ko_KR': '숫자 기반 용어는 최대 최소값, 불확실성 값, 스윕 가능 여부에 따라 다양한 변이가 존재한다.'
						},
						tooltip:{
							'en_US': 'A Group of various variations of the numeric-based term',
							'ko_KR': '숫자 기반 변이 용어 그룹'
						},
						state: Term.STATE_ACTIVE,
						order: 5
					},
					{
						termType: TermTypes.NUMERIC,
						termName: 'humanWeight',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Weight',
							'ko_KR': '체중'
						},
						definition:{
							'en_US': 'Weight of human being',
							'ko_KR': '사람의 체중'
						},
						tooltip:{
							'en_US': 'NumericTerm having min, max, uncertainty attributes',
							'ko_KR': '최소, 최대, 오차 속성을 가진 NumericTerm'
						},
						mandatory: true,
						placeHolder:{
							'en_US': 'Enter valid weight',
							'ko_KR': '체중 입력'
						},
						groupTermId:{
							'name':'numericBasedTermGroup',
							'version':'1.0.0'
						},
						state: Term.STATE_ACTIVE,
						minValue: 30,
						minBoundary: true,
						maxValue: 300,
						maxBoundary: true,
						uncertainty: true,
						unit: 'kg',
						order: 1
					},
					{
						termType: TermTypes.NUMERIC,
						termName: 'humanHeight',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Height',
							'ko_KR': '신장'
						},
						definition:{
							'en_US': 'Height of human being',
							'ko_KR': '사람의 신장'
						},
						tooltip:{
							'en_US': 'NumericTerm having min, max attributes',
							'ko_KR': '최소, 최대 속성을 가진 NumericTerm'
						},
						mandatory: true,
						placeHolder:{
							'en_US': 'Enter height',
							'ko_KR': '신장 입력'
						},
						groupTermId:{
							'name':'numericBasedTermGroup',
							'version':'1.0.0'
						},
						state: Term.STATE_ACTIVE,
						minValue: 100,
						minBoundary: true,
						maxValue: 250,
						maxBoundary: true,
						unit: 'cm',
						order: 2
					},
					{
						termType: TermTypes.NUMERIC,
						termName: 'animalWeight',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Weight',
							'ko_KR': '체중'
						},
						definition:{
							'en_US': 'Weight of human being',
							'ko_KR': '사람의 체중'
						},
						tooltip:{
							'en_US': 'NumericTerm only having max attribute',
							'ko_KR': '최대 속성만 가진 NumericTerm'
						},
						mandatory: true,
						placeHolder:{
							'en_US': 'Enter valid weight',
							'ko_KR': '체중 입력'
						},
						groupTermId:{
							'name':'numericBasedTermGroup',
							'version':'1.0.0'
						},
						state: Term.STATE_ACTIVE,
						maxValue: 300,
						maxBoundary: true,
						unit: 'kg',
						order: 3
					},
					{
						termType: TermTypes.NUMERIC,
						termName: 'animalHeight',
						termVersion: '1.0.0',
						displayName: {
							'en_US': 'Height',
							'ko_KR': '신장'
						},
						definition:{
							'en_US': 'Height of animal',
							'ko_KR': '동물의 신장'
						},
						tooltip:{
							'en_US': 'NumericTerm only having min attributes',
							'ko_KR': '최소 속성만 가진 NumericTerm'
						},
						mandatory: true,
						placeHolder:{
							'en_US': 'Enter height',
							'ko_KR': '신장 입력'
						},
						groupTermId:{
							'name':'numericBasedTermGroup',
							'version':'1.0.0'
						},
						state: Term.STATE_ACTIVE,
						minValue: 10,
						minBoundary: true,
						unit: 'cm',
						order: 4
					}
				]
			};

			/*
			this.parse( dataStructure, this.terms ? this.terms.length : 0 );
			
			this.setTermsDirty( false );
			this.render( Constants.FOR_PREVIEW, $canvas );

			let firstTerm = this.terms[0];

			let dataPacket = Util.createEventDataPacket(NAMESPACE, NAMESPACE);
			dataPacket.term = firstTerm;
				
			Util.fire( Events.DATATYPE_TERM_SELECTED, dataPacket );
			*/
		}

	}

	class Query{
		#id;
		#parentId;
		#operator;
		#hits;

		get id(){ return this.#id; }
		set id(val){ this.#id = val; }
		get parentId(){ return this.#parentId; }
		set parentId(val){ this.#parentId = val; }
		get operator(){ return this.#operator; }
		set operator(val){ 
			this.#operator = val; 
		}
		get hits(){ return this.#hits; }
		set hits(val){ 
			this.#hits = val;
		}
		get hitCount(){ return this.hits ? this.hits.length : undefined; }
		get title(){
			let title = this.operator;
			title += this.hits ? ('('+this.hitCount+')') : '';

			return title;
		}

		constructor( operator, parentId ){
			this.id = Util.randomString( 10, 'aA1' );
			this.parentId = parentId;
			this.operator = operator;
		}

		renderHits( start, delta, $container, queriedFields ){
			for( let i=start; i < (delta+start) && i<this.hits.length; i++ ){
				$container.append( this.$renderHit( this.hits[i], i+1, queriedFields ) );
			};
		}

		getSearchedContent( record, queriedFields ){
			let content = new Object();
			
			queriedFields.forEach( fieldName => {
				let names = fieldName.split('.');
				
				let fieldData = record.data[names[0]];
				if(names.length === 2){
					content[names[1]] = GridTerm.getColumnValues( fieldData, names[1] );
				}
				else{
					content[names[0]] = fieldData;
				}
			});

			return JSON.stringify(content);
		}

		$renderHit( hit, index, queriedFields ){
			let $row = $('<div class="row" style="padding-top:3px; padding-bottom:3px;width:100%;">');
			
			let $indexCol = $('<div class="col-md-1 index-col">');
			//let $indexSpan = $('<span>').appendTo($indexCol);
			$indexCol.text( index );
			$indexCol.css('text-align', 'center');
			$row.append( $indexCol );

			let $idCol = $('<div class="col-md-2" style:"padding:0;">');
			$idCol.text( hit.id );
			$idCol.css('text-align', 'center');
			$row.append( $idCol );
			
			let $contentCol = $('<div class="col-md-8" style="display:flex;">');
			let $content = $('<span>').appendTo( $contentCol );
			$content.text( this.getSearchedContent(hit, queriedFields) );

			$row.append( $contentCol );
			
			let $actionCol = $('<div class="col-md-1 action-col">');
			$actionCol.append( FormUIUtil.$getActionButton() );
			$row.append( $actionCol );
			
			return $row;
		}

		isLeaf(){
			return  this instanceof FieldKeyword ||
					this instanceof ColumnKeyword;
		}

		toZTreeJSON(){
			return {
				'id': this.id,
				'pid': this.parentId,
				'operator': this.operator,
				'hitCount': this.hitCount,
				'open': true,
				'title': this.title
			};
		}

		toJSON(){
			return {
				'id': this.id,
				'pid': this.parentId,
				'operator': this.operator,
				'hits': this.hits
			};
		}

		toDeliverString(){
			return {
				'operator': this.operator,
				'hits': this.hits.map( hit => hit.id ),
				'hitCount': this.hitCount,
				'children': new Array()
			}
		}
	}

	class GridQuery extends Query{
		#fieldName;

		get fieldName(){ return this.#fieldName; }
		set fieldName(val){ this.#fieldName = val; }

		get title(){
			let title = this.fieldName + '.' + this.operator;
			title += this.hits ? ('('+this.hitCount+')') : '';

			return title;
		}

		constructor( fieldName, parentId ){
			super( Constants.SearchOperators.AND, parentId );

			this.fieldName = fieldName;
		}

		toZTreeJSON(){
			let json = super.toZTreeJSON();
			json.fieldName = this.fieldName;

			return json;
		}

		toJSON(){
			let json = super.toJSON();
			json.fieldName = this.fieldName;

			return json;
		}
	}
	
	class FieldKeyword extends Query{
		#fieldName;
		#fieldType;
		#columnName;
		#columnType;
		#keyword;

		get fieldName(){ return this.#fieldName; }
		set fieldName(val){ this.#fieldName = val; }
		get fieldType(){ return this.#fieldType; }
		set fieldType(val){ this.#fieldType = val; }
		get columnName(){ return this.#columnName; }
		set columnName(val){ this.#columnName = val; }
		get columnType(){ return this.#columnType; }
		set columnType(val){ this.#columnType = val; }
		get keyword(){ return this.#keyword; }
		set keyword(val){ this.#keyword = val; }
		get field(){ 
			return this.isColumn() ? 
						this.fieldName + '.'+this.#columnName : this.fieldName;
		}
		get value(){
			let val = '';

			if( this.operator === Constants.SearchOperators.RANGE ){
				if( this.fieldType === TermTypes.DATE ||
					this.columnType === TermTypes.DATE ){
					val += this.keyword.from ? (Util.toDateString(this.keyword.from) + '~') : '~';
					val += this.keyword.to ? Util.toDateString(this.keyword.to) : '';
				}
				else{
					val += this.keyword.from ? (this.keyword.from + '~') : '~';
					val += this.keyword.to ? this.keyword.to : '';
				}
			}
			else{
				val += (this.fieldType === TermTypes.DATE) ? 
								Util.toDateString(this.keyword) : this.keyword;
			}

			return val;
		}
		get title(){
			return '\"' + this.field + '\" ' + this.operator + ' \"' + this.value + 
								'\"(' + this.hitCount + ')';
		}
		get deliverString(){
			return this.field + ' ' + this.operator + ' ' + this.value;
		}

		constructor( fieldName, fieldType, keyword, operator, parentId ){
			super( operator, parentId );

			this.fieldName = fieldName;
			this.fieldType = fieldType;
			this.keyword = keyword;
		}

		isColumn(){
			return !!this.columnName && !!this.columnType;
		}

		itsMe( fieldName, keyword, operator ){
			return this.fieldName === fieldName && 
					this.keyword === keyword &&
					this.operator === operator;
		}

		hasKeyword(){
			return Util.isNotEmpty( this.#keyword );
		}

		toZTreeJSON(){
			return {
				'id': this.id,
				'pid': this.parentId,
				'fieldName': this.fieldName,
				'fieldType': this.fieldType,
				'columnName': this.columnName,
				'columnType': this.columnType,
				'field': this.field,
				'keyword': this.keyword,
				'value': this.value,
				'operator': this.operator,
				'hitCount': this.hitCount,
				'open': true,
				'title': this.title
			};
		}

		toJSON(){
			return {
				'id': this.id,
				'pid': this.parentId,
				'fieldName': this.fieldName,
				'fieldType': this.fieldType,
				'columnName': this.columnName,
				'columnType': this.columnType,
				'field': this.field,
				'keyword': this.keyword,
				'operator': this.operator,
				'hits': this.hits
			};
		}
	}

	class ColumnKeyword extends FieldKeyword{
		constructor( fieldName, columnName, columnType, keyword, operator, parentId){
			super( fieldName, TermTypes.GRID, keyword, operator, parentId );

			this.columnName = columnName;
			this.columnType = columnType;
		}
	}

	class SearchHistory{
		#subject;
		#rootQuery;
		#queries;
		#hits;
		#dataList;
		#zTreeObj;
		#createDate;
		#modifiedDate;

		get subject(){ 
			if( !this.#subject )	return new Date(this.#modifiedDate).toLocaleString();
			else	return this.#subject;
		}
		set subject(val){ this.#subject = val; }
		get queries(){ return this.#queries; }
		set queries(val){ this.#queries = val; }
		get rootQuery(){ 
			let rootQuery;
			this.#queries.every( query => {
				if( !query.parentId ){
					rootQuery = query;
					return Constants.STOP_EVERY;
				}
				return Constants.CONTINUE_EVERY;
			});

			return rootQuery; 
		}
		
		get hits(){ return this.#hits; }
		set dataList(val){ this.#dataList = val; }
		get dataList(){ return this.#dataList; }
		set hits(val){ this.#hits = val; }
		get zTreeObj(){ return this.#zTreeObj; }
		set zTreeObj(val){ this.#zTreeObj = val; }
		get zTreeRoot() { return this.#zTreeObj.getNodes()[0]; }
		get createDate(){ return this.#createDate; }
		set createDate(val){ this.#createDate = val; }
		get localeCreateDate(){
			return new Date(this.#createDate).toLocaleString();
		}
		get modifiedDate(){ return this.#modifiedDate; }
		set modifiedDate(val){ this.#modifiedDate = val; }
		get localeModifiedDate(){
			return new Date(this.#modifiedDate).toLocaleString();
		}
		
		get hitCount(){ return this.#hits.length; }

		constructor( dataList ){
			this.queries = new Array();
			this.dataList = dataList;
		}

		/**
		 * Appends queries as children of parentQueryId to
		 * SearchHistory queries.
		 * 
		 * @param {String} parentQueryId 
		 * @param {Array[Query]} queries 
		 * @returns 
		 */
		appendQueries( parentQueryId, queries ){
			queries.forEach( query => {
				if( !query.parentId ){
					query.parentId = parentQueryId;
				}

				this.#queries.push( query );
			});
		}

		constructTreeRoot( queries, operator ){
			let newRoot = new Query( operator, null );
			this.#queries.push( newRoot );

			this.rootQuery.parentId = newRoot.id;
			this.appendQueries( newRoot.id, queries );
		}

		/**
		 * adds a query part to the query stack.
		 * 
		 * @param {Query} partRoot 
		 * @param {Array} newQueries 
		 */
		addQuery( partRoot, newQueries ){
			let rootQuery = this.rootQuery;

			if( Util.isEmpty(rootQuery) ){
				newQueries.forEach( query => this.#queries.push(query) );
			}
			else if( rootQuery instanceof FieldKeyword ){
				if( partRoot instanceof FieldKeyword &&
					rootQuery.fieldName === partRoot.fieldName &&
					rootQuery.operator === partRoot.operator ){
					this.constructTreeRoot( newQueries, Constants.SearchOperators.OR );
				}
				else{
					this.constructTreeRoot( newQueries,  Constants.SearchOperators.AND );
				}
			}
			else if( rootQuery instanceof GridQuery ){
				if( partRoot instanceof GridQuery &&
					rootQuery.fieldName === partRoot.fieldName &&
					rootQuery.operator === partRoot.operator ){
					this.appendQueries( rootQuery.id, newQueries );
				}
				else{
					this.constructTreeRoot( newQueries,  Constants.SearchOperators.AND );
				}
			}
			else{
				this.constructTreeRoot( newQueries, Constants.SearchOperators.AND );
			}
		}

		/**
		 * returns children queries of a query
		 * 
		 * @param {string} parentId 
		 * @returns
		 * 	Array of Query instances 
		 */
		getQueryChildren( parentId ){
			return this.queries.filter( query => {
				return query.parentId === parentId;
			});
		}

		/**
		 * creates JSON object of a query tree.
		 * 
		 * @param {Query} query 
		 * @returns 
		 * 	JSON Object. Note that it is not same with any zTree node
		 */
		getQueryJSON( query ){
			let queries;
			let json;
			if( Util.isEmpty(query) ){
				queries = this.queries;
				json = new Array();
			}
			else{
				queries = this.getQueryChildren( query.id );
				json = query.toQueryJSON();
				json.children = new Array();
			}

			if( queries.length > 0 ){
				queries.forEach( childQuery => {
					let jsonQuery = this.getQueryJSON( childQuery );
					if( json instanceof Array ){
						json.push( jsonQuery );
					}
					else{
						json.children.push( jsonQuery );
					}
				});
			}

			return json;
		}

		/**
		 * creates simple data array for zTree
		 * 
		 * @returns
		 * 	zTreeNode[]
		 */
		getZTreeSimpleData(){
			return this.queries.map( query => query.toZTreeJSON() );
		}

		/**
		 * Removes the query defined as queryId. if removeTree is true,
		 * all children queries would be removed.
		 * 
		 * @param {String} queryId 
		 * @param {boolean} removeTree 
		 * @returns 
		 * 	Query object removed
		 */
		removeQuery( queryId, removeTree=false ){
			if( !this.queries )	return;

			let removedQuery, children;
			this.queries = this.queries.filter( query => {
				if( query.id === queryId ){
					removedQuery = query;
					return Constants.FILTER_SKIP;
				}

				return Constants.FILTER_ADD;
			});

			if( !!removedQuery ){
				children = this.getQueryChildren( removedQuery.id );
				children.forEach( child => {
					if( removeTree ){
						this.removeQuery( child.id, true );
					}
					else{
						child.parentId = removedQuery.parentId;
					}
				});
			}

			let parent = !!removedQuery ? this.getQuery( removedQuery.parentId ) : null;
			if( !!parent ){
				children = this.getQueryChildren( parent.id );
				if( children.length <= 1 ){
					removedQuery = this.removeQuery( parent.id );
				}
			}

			return removedQuery;
		}

		/**
		 * Gets a query tree from this.#queries as if query as the root.
		 * 
		 * @param {Query} query 
		 * @returns
		 * 	Array[Query]
		 */
		getQueryTree( query ){
			let queryTree = new Array();

			queryTree.push( query );
			let children = this.getQueryChildren( query.id );
			children.forEach( child => {
				queryTree = queryTree.concat( this.getQueryTree( child ) );
			});

			return queryTree;
		}

		/**
		 * Evaluates search queries of the SearchHistory.
		 * All asendant query results of the query maybe changed.
		 * 
		 * @param {Query} query 
		 */
		evaluateQuery( query ){
			if( !query ){
				this.retrieve( this.rootQuery, this.#dataList );
			}
			else if( !!query.parentId ){
				let parent = this.getQuery( query.parentId );
				let children = this.getQueryChildren( parent.id );
				if( parent.operator === Constants.SearchOperators.OR ){
					this.#doORSearch( parent, children );
				}
				else{
					this.#doANDSearch( parent, children );
				}

				if( !!parent.parentId ){
					this.evaluateQuery( parent );
				}
			}
		}

		retrieve( query, dataList ){
			if( !query )	return dataList;

			let children = this.getQueryChildren( query.id );
			children.forEach( child => {
				if( child instanceof FieldKeyword ||
					child instanceof ColumnKeyword ){
					if( child.hitCount === undefined ){
						this.retrieve( child, dataList );
					}
				}
				else{
					this.retrieve( child, dataList );
				}
			});

			switch( query.operator ){
				case Constants.SearchOperators.OR:{
					this.#doORSearch( query, children );
					break;
				}
				case Constants.SearchOperators.AND:{
					this.#doANDSearch( query, children );
					break;
				}
				case Constants.SearchOperators.LIKE:{
					this.#doLikeSearch( query, dataList );
					break;
				}
				case Constants.SearchOperators.EXACT:{
					this.#doExactSearch( query, dataList );
					break;
				}
				case Constants.SearchOperators.RANGE:{
					this.#doRangeSearch( query, dataList );
					break;
				}
				case Constants.SearchOperators.NOT:{
					this.#doNotSearch( query, dataList );
					break;
				}
				
			}
		}

		isColumnQuery( query ){
			return query instanceof ColumnKeyword;
		}

		#doORSearch( queryNode, queries ){
			queryNode.hits = new Array();

			queries.forEach( query => {
				if( !query.hits )	return;

				queryNode.hits = queryNode.hits.concat( 
							query.hits.filter( data => !queryNode.hits.includes( data ) ) );
			});

			return queryNode.hits;
		}

		#doANDSearch( queryNode, queries){
			if( !queries || queries.legth === 0 ){
				return;
			}

			queryNode.hits = queries[0].hits;

			for( let i=1; i<queries.length; i++ ){
				let hits = queries[i].hits;
				queryNode.hits = ( !hits || hits.length === 0 ) ?
									[] : hits.filter( data => queryNode.hits.includes( data ) );
			}

			return queryNode.hits;
		}

		/**
		 * Range search is allowed for only numeric and date
		 * 
		 * @param {Array} dataList 
		 * @returns 
		 */
		#doRangeSearch( query, dataList ){
			if( !dataList ){
				return;
			}

			query.hits = dataList.filter( record => {
				let fieldContent = record.data[query.fieldName];
				if( !fieldContent ) return Constants.FILTER_SKIP;

				if( query instanceof ColumnKeyword ){
					let conform = false;
					let columnContent = GridTerm.getColumnValues(fieldContent, query.columnName);
					columnContent.every( content => {
						let value = (typeof content === 'object') ? content.value : content;
						conform = Util.conformInRange( query.keyword.from, query.keyword.to, value );
						return !conform;
					});

					return conform;
				}
				else{
					let value = (typeof fieldContent === 'object') ? fieldContent.value : fieldContent
					return Util.conformInRange( query.keyword.from, query.keyword.to, value );
				}
			});
		}

		#doExactSearch( query, dataList ){
			if( !dataList ){
				return;
			}

			let searchType = query instanceof ColumnKeyword ? query.columnType : query.fieldType;

			query.hits = dataList.filter( record => {
				let fieldContent = record.data[query.fieldName];
				if( !fieldContent ) return Constants.FILTER_SKIP;

				let searchContent = query instanceof ColumnKeyword ?
										GridTerm.getColumnValues(fieldContent, query.columnName) :
										fieldContent;
				if( Util.isEmpty(searchContent) ) return Constants.FILTER_SKIP;


				switch( searchType ){
					case TermTypes.LIST:{
						if( query instanceof ColumnKeyword ){
							let equal = false;
							// searchIndex format: [[a],[a.b],[a,b,c]]
							searchContent.every( content => {
								let lower = content.map( elem => elem.toLowerCase() );
								equal = lower.includes( query.keyword.toLowerCase() );
								return !equal;
							});

							return equal; 
						}
						else{
							let content = searchContent.map( content => content.toLowerCase() );
							return content.includes( query.keyword.toLowerCase() );
						};

						break;
					}
					case TermTypes.NUMERIC:{
						if( query instanceof ColumnKeyword ){
							let equal = false;
							// searchIndex format: [1,2,3] or [{}, {}, {}]
							searchContent.every( content => {
								let value = typeof content === 'object' ? content.value : content;
								equal = value == query.keyword;
								return !equal;
							});

							return equal;
						}
						else{
							let value = typeof searchContent === 'object' ? searchContent.value : searchContent;
							return value == query.keyword;
						};

						break;
					}
					default:{
						if( query instanceof ColumnKeyword ){
							let equal = false;
							searchContent.every( content => {
								equal = content === query.keyword;
								return !equal;
							});

							return equal;
						}
						else{
							return searchContent === query.keyword;
						};
					}
				}
	
			});
		}

		/**
		 * LIKE search is allowed for String-based types and File type.
		 * 
		 * @param {Query} query 
		 * @param {Array} dataList 
		 * @returns 
		 */
		#doLikeSearch( query, dataList ){
			if( !dataList ){
				return;
			}

			query.hits = dataList.filter( record => {
				let fieldContent = record.data[query.fieldName];
				if( Util.isEmpty(fieldContent) ) return Constants.FILTER_SKIP;

				let searchContent = query instanceof ColumnKeyword ?
										GridTerm.getColumnValues(fieldContent, query.columnName) :
										fieldContent;
				if( Util.isEmpty(searchContent) )	return Constants.FILTER_SKIP;


				switch( query.fieldType ){
					case TermTypes.FILE:{
						let fileNames = Object.keys( searchContent );

						let included = false;
						fileNames.every( fileName => {
							included = fileName.toLowerCase().includes( query.keyword.toLowerCase() );
							return !included;
						});

						return included;
					}
					default:{
						if( query instanceof ColumnKeyword ){
							let included = false;
							searchContent.every( content => {
								included = content.toLowerCase().includes( query.keyword.toLowerCase() );
								return !included;
							});

							return included;
						}
						else{
							return searchContent.toLowerCase().includes( query.keyword.toLowerCase() );
						};
					}
				}
			});
		}

		/**
		 * NOT operator performs only exact match
		 * 
		 * @param {Query} query 
		 * @param {Array} dataList 
		 * @returns
		 * 	array of hits
		 */
		#doNotSearch( query, dataList ){
			if( !dataList ){
				return;
			}

			query.hits = dataList.filter( record => {
				let fieldContent = record.data[query.fieldName];
				if( !fieldContent ) return Constants.FILTER_SKIP;

				let searchIndex = query instanceof ColumnKeyword ?
										fieldContent[query.columnName]:
										fieldContent;
				if( !searchIndex ) return Constants.FILTER_SKIP;

				switch( searchType ){
					case TermTypes.LIST:{
						if( query instanceof ColumnKeyword ){
							let equal = false;
							// searchIndex format: [[a],[a.b],[a,b,c]]
							searchIndex.every( index => {
								equal = index.toLowerCase().includes(query.keyword.toLowerCase());
								return !equal;
							});

							return !equal;
						}
						else{
							return !searchIndex.toLowerCase().includes( query.keyword.toLowerCase() );
						};
					}
					case TermTypes.FILE:{
						let fileNames = Object.keys( searchIndex );

						let included = false;
						fileNames.every( fileName => {
							included = fileName.toLowerCase().includes( query.keyword.toLowerCase() );
							return !included;
						});

						return !included;
					}
					default:{
						if( query instanceof ColumnKeyword ){
							let equal = false;
							searchIndex.every( index => {
								equal = index === query.keyword;
								return !equal;
							});

							return !equal;
						}
						else{
							return !searchIndex.includes( query.keyword );
						};
					}
				}
	
			});
		}

		getQuery( queryId ){
			if( !this.#queries )	return null;
			if( !queryId )	return null;

			let searchedQuery = null;
			this.#queries.every( query => {
				if( query.id === queryId ){
					searchedQuery = query;
					return Constants.STOP_EVERY;
				}

				return Constants.CONTINUE_EVERY;
			});

			return searchedQuery;
		}

		getQueries( fieldName ){
			if( !this.#queries )	return new Array();
			
			return this.#queries.filter( query => (fieldName === query.fieldName || 
												   fieldName === query.columnName) );
		}

		getQueriedFields( query ){
			let queriedFields = new Array();

			if( query instanceof ColumnKeyword ){
				queriedFields.push( query.fieldName+'.'+query.columnName );
			}
			else if( query instanceof FieldKeyword ){
				queriedFields.push( query.fieldName );
			}
			else{
				let childFields = this.getQueryChildren( query.id );
				childFields.forEach( child => {
					let subFieldNames = this.getQueriedFields( child );
					subFieldNames.forEach( fieldName => {
						if( !queriedFields.includes(fieldName) ){
							queriedFields.push( fieldName );
						}
					});
				});
			}
			
			return queriedFields;
		}

		showSearchResults( queryId, $canvas ){
			let query = this.getQuery(queryId );
			let results = query.hits;

			let queriedFields = this.getQueriedFields( query );
			$canvas.empty();

			let delta = 10;
			let $pagination = $('<div>').appendTo( $canvas );
			let $container = $('<div class="container" style="padding:0;">').appendTo($canvas);

			$pagination.pagination({
				items: results.length,
				itemsOnPage: delta,
				displayedPages: 3,
				onPageClick: function( pageNumber, event){
					$container.empty();
					query.renderHits( (pageNumber-1)*delta, delta, $container, queriedFields );
				},
				onInit: function(){
					query.renderHits( 0, delta, $container, queriedFields );
				}
			});

			let deliverJSON = {
				query: this.toDeliverString( query ),
				hits: query.hits.map( hit => hit.id )
			};

			this.fireDeliverObjectEvent( deliverJSON );
		}

		fireDeliverObjectEvent( payload ){
			let eventData = new EventDataPacket(NAMESPACE,NAMESPACE);
			eventData.deliverObj = payload;

			Util.fire( Events.SEARCH_QUERY_DELIVER, eventData );
		}

		updateQueryOperator( queryId, operator ){
			let query = this.getQuery( queryId );
			query.operator = operator;
			
			return query;
		}

		synchronizeZTreeNode( node ){
			let changedNode = this.getZTreeNode( node.id );
			node.operator = changedNode.operator;
			node.hitCount = changedNode.hitCount;
			node.title = changedNode.title;

			let pNode = node.getParentNode();
			if( pNode ){
				this.synchronizeZTreeNode( pNode );
			}
		}

		removeZTreeNode( node ){
			this.zTreeObj.removeNode( node, true );
		}

		refreshZTree(){
			this.zTreeObj.refresh();
		}

		$render( order ){
			let $row = $('<tr>');
			
			$row.append( $('<td>' + order + '</td>' ) );

			$row.append( $('<td style="text-align:center;">'+this.fieldName+'</td>') );

			if( keywords instanceof Array ){
				$row.append( $('<td style="text-align:center;">'+this.keywords +'</td>') );
			}
			else{
				$row.append( $('<td style="text-align:center;">'+
									( Util.isNotEmpty(this.keywords.from) ? this.keywords.from:'') + 
									' ~ ' + 
									(Util.isNotEmpty(this.keywords.to) ? this.keywords.to:'') +'</td>') );
			}

			let infieldResultCount = this.infieldResults ? this.infieldResults.length : 0;
			let $infieldResults = $('<td style="text-align:center;">'+infieldResultCount+'</td>' ).appendTo($row);

			$infieldResults.click( function(event){
				console.log('field results clicked');
			});

			if( this.orderResults ){
				let $orderResults = $('<td style="text-align:center;">'+this.orderResults.length+'</td>').appendTo($row);
				$orderResults.click( function(event){
					console.log('order results clicked');
				});
			}

			return $row;
		}

		
		toDeliverString( query ){

			if( Util.isEmpty( query ) ){
				return '';
			}
			
			if( query.isLeaf() ){
				return query.deliverString;
			}
			else{
				let deliverArray = new Array();
				let children = this.getQueryChildren( query.id );
				if( Util.isNotEmpty(children) ){
					children.forEach( child => {
						deliverArray.push( this.toDeliverString(child) );
					});

					return '(' + deliverArray.join(' '+query.operator+' ') + ')';
				}
			}

			return '';
		}
	}

	class SearchData{
		#id;
		#data;
		#abstract;
		#baseLinkURL;
		#$rendered;

		get id(){ return this.#id; }
		set id(val){ this.#id = val; }
		get data(){ return this.#data; }
		set data(val){ this.#data = val; }
		get abstract(){ return this.#abstract; }
		set abstract(val){ this.#abstract = val; }
		get baseLinkURL(){ return this.#baseLinkURL; }
		set baseLinkURL(val){ this.#baseLinkURL = val; }

		constructor( id, data, abstract, baseLinkURL){
			this.id = id;
			this.data = data;
			this.abstract = abstract;
			this.baseLinkURL = baseLinkURL;
		}

		$render( visibility ){
			let $row = $('<div class="row" style="padding-top:3px; padding-bottom:3px;width:100%;">');
			
			let $col_1 = $('<div class="col-md-1 index-col" style:"text-align:right;">');
			//$col_1.text( index );
			$row.append( $col_1 );
			
			let $col_2 = $('<div class="col-md-10 abstract-col">');
			let $href = $('<a>');
			
			
			let renderUrl = Liferay.PortletURL.createURL(this.baseLinkURL);
			renderUrl.setParameter("structuredDataId", this.id);
			
			$href.prop('target', '_blank' );
			$href.prop('href', renderUrl.toString() );
			$col_2.append( $href );
			
			
			$href.text( this.abstract );
			$row.append( $col_2 );
			
			let $col_3 = $('<div class="col-md-1 action-col">');
			$col_3.append( FormUIUtil.$getActionButton() );
			$row.append( $col_3 );
			
			$row = visibility ? $row.show() : $row.hide();

			this.#$rendered = $row;

			return $row;
		}

		setRenderOrder( order ){
			this.#$rendered.find( '.index-col' ).text( order );
		}

		hide(){
			this.#$rendered.find( '.index-col' ).empty();
			this.#$rendered.hide();
		}

		show( index ){
			this.setRenderOrder( index );

			if( index % 2 ){
				this.#$rendered.css('background', '#fff');
			}
			else{
				this.#$rendered.css('background', '#eee');
			}

			this.#$rendered.show();
		}

	}


	class AdvancedSearch{
		#dataStructure;
		#baseLinkURL
		#abstractFields;
		#$querySection;
		#$resultSection;
		#searchHistories;
		#dataList;
		#writingQuery;

		get dataStructure(){ return this.#dataStructure; }
		set dataStructure(val){ this.#dataStructure = val; }
		get baseLinkURL(){ return this.#baseLinkURL; }
		set baseLinkURL(val){ this.#baseLinkURL = val; }
		get abstractFields(){ return this.#abstractFields; }
		set abstractFields(val){ this.#abstractFields = val; }
		get $querySection(){ return this.#$querySection; }
		set $querySection(val){ this.#$querySection = val; }
		get $resultSection(){ return this.#$resultSection; }
		set $resultSection(val){ this.#$resultSection = val; }
		get searchHistories(){ return this.#searchHistories; }
		set searchHistories(val){ this.#searchHistories = val; }
		get dataList(){ return this.#dataList; }
		set dataList(val){ this.#dataList = val; }
		get writingQuery(){ return this.#writingQuery; }
		set writingQuery(val){ this.#writingQuery = val; }
		get writingQueryRoot() { 
			let root;
			this.#writingQuery.every( query => {
				if( Util.isEmpty(query.parentId) ){
					root = query;
					return Constants.STOP_EVERY;
				}
				else{
					return Constants.CONTINUE_EVERY;
				}
			});

			return root;
		}

		get currentHistory(){ 
			if(this.#searchHistories.length < 1){
				this.#searchHistories.push( new SearchHistory( this.dataList ) );
			}
				
			return this.#searchHistories[this.#searchHistories.length-1];
		}

		get fieldOperator(){ return $('#'+NAMESPACE+'fieldOperator').val(); }
		get $fieldOperator(){ return $('#'+NAMESPACE+'fieldOperator'); }
		get infieldOperator(){ return $('#'+NAMESPACE+'infieldOperator').val(); }
		get $infieldOperator(){ return $('#'+NAMESPACE+'infieldOperator'); }

		constructor( structuredDataList, $querySection, $resultSection, baseLinkURL ){
			this.dataList = structuredDataList;
			this.baseLinkURL = baseLinkURL;
			this.$querySection = $querySection;
			this.$resultSection = $resultSection;
			this.searchHistories = new Array();
			this.writingQuery = new Array();

			let advancedSearch = this;
			this.$fieldOperator.off('change').on('change', function(event){
				if( !!advancedSearch.writingQueryRoot ){
					advancedSearch.writingQueryRoot.operator = advancedSearch.fieldOperator;
				}
			});

			Liferay.on(Events.SEARCH_KEYWORD_CHANGED, function(event){
				let dataPacket = event.dataPacket;

				if( dataPacket.targetPortlet !== NAMESPACE )	return;

				console.log( 'SEARCH_KEYWORD_CHANGED' , dataPacket, advancedSearch.dataList );
				if( dataPacket.rangeSearch ){
					if( Util.isEmpty( dataPacket.from ) &&
						Util.isEmpty( dataPacket.to ) ){
						return;
					}
				}
				else{
					if( Util.isEmpty(dataPacket.keywords) ){
						return;
					}
				}
				
				let term = dataPacket.term;
				
				let gridTerm, query, fieldName, fieldType, 
				columnName, columnType, operator, keywords;
				let searchType;
				let targetQuery = term.isColumn() ? 
										advancedSearch.getWritingColumnQuery( term.termName ) :
										advancedSearch.getWritingFieldQuery( term.termName );

				if( dataPacket.rangeSearch ){
					if( !!targetQuery ){
						targetQuery.keyword = {
							from: dataPacket.from,
							to: dataPacket.to
						};

						return;
					}
				}

				if( term.isColumn() ){
					gridTerm = term.gridTerm;
					fieldName = gridTerm.termName;
					fieldType = TermTypes.GRID; 
					columnName = term.termName;
					searchType = columnType = term.termType;

					if( !dataPacket.rangeSearch ){
						advancedSearch.removeWritingColumnQuery( columnName );
					}
					
				}
				else{
					fieldName = term.termName;
					searchType = fieldType = term.termType;

					if( !dataPacket.rangeSearch ){
						advancedSearch.removeWritingFieldQuery( fieldName );
					}
				}

				switch( searchType ){
					case TermTypes.STRING:
					case TermTypes.PHONE:
					case TermTypes.EMAIL:
					case TermTypes.FILE:
					case TermTypes.ADDRESS:{
						operator = Constants.SearchOperators.LIKE;
						keywords = dataPacket.keywords;
						break;
					}
					case TermTypes.DATE:
					case TermTypes.NUMERIC:{
						if( dataPacket.rangeSearch ){
							if( Util.isNotEmpty(dataPacket.from) || Util.isNotEmpty(dataPacket.to) ){
								keywords = {
									from: dataPacket.from,
									to: dataPacket.to
								};
							}

							operator = Constants.SearchOperators.RANGE;
						}
						else{
							keywords = dataPacket.keywords;
							operator = Constants.SearchOperators.EXACT;
						}
						
						break;
					}
					case TermTypes.BOOLEAN:
					case TermTypes.LIST:{
						keywords = dataPacket.keywords;
						operator = Constants.SearchOperators.EXACT;

						break;
					}
					case TermTypes.MATRIX:{
						keywords = dataPacket.keywords;
						operator = Constants.SearchOperators.EXACT;

						break;
					}
				}
				
				let fieldOperator = advancedSearch.fieldOperator;
				let infieldOperator = advancedSearch.infieldOperator;

				let parentQueryId;
				let writingQueryRoot = advancedSearch.writingQueryRoot;

				if( !!writingQueryRoot ){
					if( fieldOperator !== writingQueryRoot.operator ){
						let parentQuery = new Query( fieldOperator, null );
						advancedSearch.addWritingQuery( parentQuery );
						writingQueryRoot.parentId = parentQuery.id;
						parentQueryId = parentQuery.id;
					}
					else{
						parentQueryId = writingQueryRoot.id;
					}
				}

				if( keywords.length > 1 ){
					let query = new Query( infieldOperator, parentQueryId );
					advancedSearch.addWritingQuery( query );
					
					keywords.forEach( keyword => {
						let keywordQuery = term.isColumn() ? 
						new ColumnKeyword( fieldName, columnName, columnType, keyword, operator, query.id ) :
						new FieldKeyword( fieldName, fieldType, keyword, operator, query.id );

						advancedSearch.addWritingQuery(keywordQuery );
					});
				}
				else{
					let keyword = (operator === Constants.SearchOperators.RANGE) ? keywords : keywords[0];
					query = term.isColumn() ? 
								new ColumnKeyword(
											fieldName, 
											columnName, 
											columnType, 
											keyword, 
											operator,
											parentQueryId ) : 
								new FieldKeyword(
											fieldName,
											fieldType,
											keyword,
											operator,
											parentQueryId );

					advancedSearch.addWritingQuery( query );
				}

			});

			Liferay.on(Events.SEARCH_STATE_CHANGED, function(event){
				let dataPacket = event.dataPacket;

				if( dataPacket.targetPortlet !== NAMESPACE )	return;

				console.log( 'SEARCH_STATE_CHANGED' , dataPacket );
				
				let term = dataPacket.term;

				if( dataPacket.rangeSearch ){
					if( dataPacket.from && dataPacket.to ){
						return;
					}
				}
			});
		}

		addWritingQuery( query ){
			this.#writingQuery.push( query );
		}

		getWritingQuery( queryId ){
			let wQuery;
			this.#writingQuery.every( query => {
				if( query.id === queryId ){
					wQuery = query;
					return Constants.STOP_EVERY;
				}
				return Constants.CONTINUE_EVERY;
			});

			return wQuery;
		}

		getWritingFieldQuery( fieldName ){
			let wQuery;
			this.#writingQuery.every( query => {
				if( query.fieldName === fieldName ){
					wQuery = query;
					return Constants.STOP_EVERY;
				}

				return Constants.CONTINUE_EVERY;
			});

			return wQuery;
		}

		getWritingGridQuery( fieldName ){
			return this.getWritingFieldQuery( fieldName );
		}

		getWritingColumnQuery( columnName ){
			let wQuery;
			this.#writingQuery.every( query => {
				if( query.columnName === columnName ){
					wQuery = query;
					return Constants.STOP_EVERY;
				}

				return Constants.CONTINUE_EVERY;
			});

			return wQuery;
		}

		getParantWritingQuery( fieldName ){
			let parentQuery;

			this.#writingQuery.every( query => {
				if( query.fieldName === fieldName ){
					parentQuery = this.getWritingQuery( query.parentId );
					return Constants.STOP_EVERY;
				}

				return Constants.CONTINUE_EVERY;
			});

			return parentQuery;
		}

		getWritingColumnQueries( gridId ){
			return this.#writingQuery.filter( query => query.parentId === gridId );
		}

		/**
		 * A query has children.
		 * 
		 * @param {String} parentId 
		 * @param {int} base 
		 * @returns {boolean}
		 */
		hasWritingQueryChildren( parentId ){
			let hasChildren = 0;
			this.#writingQuery.forEach( query => {
				if( query.parentId === parentId ){
					hasChildren++;
				}
			});

			return hasChildren > 0;
		}

		removeWritingFieldQuery( fieldName ){
			console.log('removeWritingFieldQuery: ', fieldName);
			let removedQuery = null;
			this.#writingQuery = this.#writingQuery.filter( query => {
				if( query.fieldName === fieldName ){
					removedQuery = query;
					return Constants.FILTER_SKIP;
				}
				return Constants.FILTER_ADD;
			});

			if( !!removedQuery ){
				let parentId = removedQuery.parentId;
				if( !!parentId && !this.hasWritingQueryChildren(parentId) ){
					this.removeWritingQuery( parentId );
				}
			}
		}

		removeWritingColumnQuery( columnName ){
			let removedQuery;
			this.#writingQuery = this.#writingQuery.filter( query => {
				if( query.columnName === columnName ){
					removedQuery = query;
					return Constants.FILTER_SKIP;
				}
				else{
					return Constants.FILTER_ADD;
				}
			});

			console.log('removedQuery: ', removedQuery );
			if( !!removedQuery ){
				let parentId = removedQuery.parentId;
				if( !!parentId && !this.hasWritingQueryChildren(parentId) ){
					this.removeWritingQuery( parentId );
				}
			}
		}

		removeWritingQuery( queryId ){
			this.#writingQuery = this.#writingQuery.filter( query => query.id !== queryId );
		}

		addWritingQueryToHistory(){
			if( Util.isEmpty(this.#writingQuery) ){
				console.log('addWritingQueryToHistory: No writing queries.');
				return;
			}

			let currentHistory = this.currentHistory;
			if( Util.isEmpty(currentHistory) ){
				currentHistory = new SearchHistory( this.dataList );
				this.#searchHistories.push( currentHistory );
			}

			currentHistory.addQuery( this.writingQueryRoot, this.writingQuery );

			this.writingQuery = new Array();
		}

		loadQueryEditor( $canvas ){
			$canvas.empty();

			let advancedSearch = this;
			let searchHistory = this.currentHistory;

			let zTreeQuery = searchHistory.getZTreeSimpleData();

			let setting = {
				data: {
					key: {
						name: 'title'
					},
					simpleData: {
						enable:true,
						idKey: 'id',
						pIdKey: 'pid',
						rootPId: null
					}
				},
				view:{
					fontCss:{
						'font-size': '0.975rem'
					}
				},
				callback:{
					onClick: function( event, treeId, node, clickFlag ){
						searchHistory.showSearchResults( node.id, advancedSearch.$resultSection );
					},
					onDrop: function(  event, treeId, nodes, clickFlag ){
						nodes.forEach( node => {
							let query = searchHistory.getQuery( node.id );
							query.parentId = node.pid;
							searchHistory.evaluateQuery( query );
						});

						advancedSearch.refreshQueryEditor();
					},
					onRemove: function(  event, treeId, node, clickFlag ){
						let query = searchHistory.removeQuery( node.id );
						//searchHistory.evaluateQuery( query );

						advancedSearch.refreshQueryEditor();
					},
					onRightClick: function( event, treeId, node, clickFlag ){
						let popItems = {
							delete: {
								name: Liferay.Language.get('delete'),
								icon: '<span class="ui-icon ui-icon-trash"></span>',
								divid: true
							}
						};

						let orItem = {
								name: 'OR',
								icon: '<span style="width:1rem;">|</span>'
						};
						let andItem = {
								name: 'AND',
								icon: '<span style="width:1rem;">&</span>'
						};
						let notItem = {
								name: 'NOT',
								icon: '<span style="width:1rem;">!</span>'
						};
						let likeItem = {
								name: 'LIKE',
								icon: '<span style="width:1rem;">&#8884;</span>'
						};
						let exactItem = {
								name: 'EXACT',
								icon: '<span style="width:1rem;">&#8803;</span>'
						};

						switch( node.operator ){
							case Constants.SearchOperators.OR:{
								popItems[Constants.SearchOperators.AND] = andItem;
								break;
							}
							case Constants.SearchOperators.AND:{
								popItems[Constants.SearchOperators.OR] = orItem;
								break;
							}
							case Constants.SearchOperators.NOT:{
								popItems[Constants.SearchOperators.EXACT] = exactItem;
								popItems[Constants.SearchOperators.LIKE] = likeItem;
								break;
							}
							case Constants.SearchOperators.LIKE:{
								popItems[Constants.SearchOperators.EXACT] = exactItem;
								popItems[Constants.SearchOperators.NOT] = notItem;
								break;
							}
							case Constants.SearchOperators.EXACT:{
								popItems[Constants.SearchOperators.LIKE] = likeItem;
								popItems[Constants.SearchOperators.NOT] = notItem;
								break;
							}
						}

						let callback = function( item ){
							
							switch( $(item).prop('id') ){
								case 'delete':{
									let selectedNodes = searchHistory.zTreeObj.getSelectedNodes();
									if (selectedNodes && selectedNodes.length>0) {
										selectedNodes.forEach( selectedNode => {
											searchHistory.removeQuery( selectedNode.id, true );
										});
									}

									let query = searchHistory.getQuery( node.id );
									searchHistory.evaluateQuery( query );
									advancedSearch.refreshQueryEditor();
									break;
								}
								default:{
									let operator = $(item).prop('id');
									searchHistory.updateQueryOperator( node.id, operator );
									searchHistory.retrieve( searchHistory.rootQuery, advancedSearch.dataList );

									advancedSearch.refreshQueryEditor();
								}
							}
						};

						let $popMenu = $('<div class="pop-menu">');

						popmenu( $popMenu, {
							items: popItems,
							callback: callback,
							x: event.clientX + $(document).scrollLeft(),
							y: event.clientY + $(document).scrollTop()
						});

					}
				},
				edit: {
					enable: true,
					showRenameBtn: false
				}
			};
		
			searchHistory.zTreeObj = $.fn.zTree.init($canvas, setting, zTreeQuery);
			searchHistory.zTreeObj.selectNode( searchHistory.zTreeRoot );

			searchHistory.showSearchResults( searchHistory.rootQuery.id, this.$resultSection);
		}

		refreshQueryEditor(){
			this.loadQueryEditor( this.#$querySection );
		}

		countSearchHistories(){
			return this.searchHistories.length;
		}

		switchSearchHistories( index_1, index_2){
			let histories = this.searchHistories;

			let sh_1 = histories[index_1];
			histories[index_1] = histories[index_2];
			histories[index_2] = sh_1;

			this.searchHistories = histories;
		}

		retrieve(){
			let history = this.currentHistory;

			if( Util.isEmpty(history.rootQuery) )	return;

			history.retrieve( history.rootQuery, this.dataList );	
		}

		#removeSearchHistory( fieldName ){
			this.searchHistories = this.searchHistories.filter( history => history.fieldName !== fieldName );
		}

		updateSearchHistory( fieldName, keywords, infieldResults, infieldOperator, fieldOperator ){
			let searchHistory = this.fetchSearchHistory( fieldName );

			if( keywords && ( Array.isArray(keywords) || keywords.from || keywords.to) ){
				if( !searchHistory ){
					searchHistory = new SearchHistory(
										fieldName, 
										keywords, 
										infieldResults,
										infieldOperator,
										fieldOperator );

					this.searchHistories.push( searchHistory );
				}
				else{
					searchHistory.update(
						keywords, 
						infieldResults,
						infieldOperator,
						fieldOperator
						);
				}
			}
			else{
				this.#removeSearchHistory( fieldName );
			}

			return this.doFieldSearch( fieldOperator );
		}

		#hideAllSearchResults(){
			this.dataList.forEach( searchData => searchData.hide() );
		}

		showSearchResults(){
			let history = this.currentHistory;
			history.showSearchResults( history.rootQuery.id, this.$resultSection);

			let treeNodes = history.zTreeObj.getNodes();
			let rootTreeNode = treeNodes[0];
			history.zTreeObj.selectNode( rootTreeNode, true, true);
		}

		displaySearchResults( results ){
			this.#hideAllSearchResults();
			if( typeof this.$resultPagination.pagination === 'function'  ){
				this.$resultPagination.pagination('destroy' );
			}

			if( !results ){
				return;
			}

			results.forEach( (result, index) => result.show( index+1 ) );

			this.$resultPagination.pagination({
				items: results.length,
				itemsOnPage: 20,
				displayedPages: 3,
				onPageClick: function( pageNumber, event){
					let delta = this.itemsOnPage;	
					
					results.forEach( (result, index) => {
						if( index >= delta * (pageNumber-1) && index < delta*pageNumber ){
							result.show( index+1 );
						}
						else{
							result.hide();
						}
					});
				},
				onInit: function(){
					let delta = this.itemsOnPage;	
					results.forEach( (result, index) => {
						if( index < delta ){
							result.show( index+1 );
						}
						else{
							result.hide();
						}
					});
				}
			});
		}

		getSearchHistories(){
			return this.searchHistories.map( (history, index) => {
				return {
					order: index + 1,
					results: history.orderResults ? history.orderResults.map( result => result.id ) : [],
					fieldName: history.fieldName
				};
			});
		}

		displaySearchDataDialog( title, searchDataArray ){
			let self = this;
			let $dialog = $('<div>');

			let $table = $('<table style="width:100%;">').appendTo( $dialog );
			let $pagination = $('<div class="pagination" style="margin-top:30px; width:100%; display:flex; justify-content:center;">').appendTo($dialog);

			$pagination.pagination({
					items: searchDataArray.length,
					itemsOnPage: 10,
					onPageClick: function( pageNumber, event){
						let delta = this.itemsOnPage;	
						let $items = $table.children();
						
						$items.each( (index, item) => {
							if( index >= delta * (pageNumber-1) && index < delta*pageNumber ){
								$(item).find('.index-col').text( index+1 );
								$(item).show();
							}
							else{
								$(item).hide();
							}
						});							
					},
					onInit: function(){
						let delta = this.itemsOnPage;
						searchDataArray.forEach( (searchData, index) => {
							let clone = new SearchData( searchData.id, searchData.data, searchData.abstract, searchData.baseLinkURL);
							clone.$rendered = searchData.$rendered.clone();
							if( delta > index ){
								clone.show( index+1 );
							}
							else{
								clone.setRenderOrder( index + 1 );
								clone.hide();
							}
							$table.append( clone.$rendered );
						});
					}
			});

			$dialog.dialog({
				title: title,
				width:800,
				buttons:[{
					text: Liferay.Language.get('ok'),
					click: function( event ){
						$(this).dialog('destroy');
					}
				}]
			});

		}

		showSearchHistories(){
			let self = this;
			let $dialog = $('<div>');

			let $table = $('<table style="width:100%;">').appendTo( $dialog );
			$table.append( $('<thead style="background:#c5c5c5">'+
								'<tr>'+
									'<th style="text-align:center;width:10%;">'+Liferay.Language.get('order')+'</th>'+
									'<th style="text-align:center;width:30%;">'+Liferay.Language.get('item')+'</th>'+
									'<th style="text-align:center;width:30%;">'+Liferay.Language.get('keywords')+'</th>' +
									'<th style="text-align:center;width:10%;">'+Liferay.Language.get('field-results')+'</th>' +
									'<th style="text-align:center;width:10%;">'+Liferay.Language.get('accumulated-results')+'</th>' +
									'<th style="text-align:center;width:10%;">'+Liferay.Language.get('actions')+'</th>' +
								'</tr>'+
							 '</thead>'));
			
			let $tbody = $('<tbody>').appendTo($table);

			this.searchHistories.forEach( (history, index) => {
				let $row = $('<tr>').appendTo($tbody);

				$row.append( $( '<td style="text-align:center;">' + (index+1) +'</td>' +
								'<td style="text-align:center;">' + history.fieldName +'</td>' ) );

				if( history.keywords instanceof Array ){
					$row.append( $( '<td style="text-align:center;">' + history.keywords+'</td>' ) );
				}
				else{
					$row.append( $('<td style="text-align:center;">'+(history.keywords.from ? history.keywords.from:'') + 
									' ~ ' + (history.keywords.to ? history.keywords.to:'') +'</td>'));
				}

				let $infieldResults = $('<td style="text-align:center;">' + history.infieldResults.length+'</td>').appendTo($row);
				$infieldResults.click( function(event){
					self.displaySearchDataDialog( history.fieldName, history.infieldResults );
				});

				let $orderResults = $('<td style="text-align:center;">' + history.orderResults.length+'</td>').appendTo($row);
				$orderResults.click( function(event){
					self.displaySearchDataDialog( history.fieldName, history.orderResults );
				});

				let $actions = $('<td style="text-align:center;">' ).appendTo($row);
				if( index < this.searchHistories.length - 1 ){
					let $moveDown = $('<span class="ui-icon ui-icon-circle-arrow-s"></span>').appendTo($actions);
					$moveDown.click( function(event){
						let nextIndex = index + 1;
						let lastINdex = self.searchHistories.length - 1;
						if( index < lastINdex ){
							if( typeof $dialog.dialog === 'function' ){
								$dialog.dialog('destroy');
							}
							
							self.switchSearchHistories( index, nextIndex);
							let searchResults = self.doFieldSearch( 'and' );
							self.displaySearchResults( searchResults );
							self.showSearchHistories();

							Liferay.fire(
								Events.SEARCH_HISTORY_CHANGED,
								{}
							);
						}
					});
				}

				if( index > 0 ){
					let $moveUp = $('<span class="ui-icon ui-icon-circle-arrow-n"></span>').appendTo($actions);
					$moveUp.click( function(event){
						let prevIndex = index - 1;
						if( index > 0 ){
							if( typeof $dialog.dialog === 'function' ){
								$dialog.dialog('destroy');
							}
							
							self.switchSearchHistories( prevIndex, index );
							let searchResults = self.doFieldSearch( 'and' );
							self.displaySearchResults( searchResults );
							self.showSearchHistories();

							Liferay.fire(
								Events.SEARCH_HISTORY_CHANGED,
								{}
							);
						}
					});
				}
			});

			$tbody.find("tr").filter(":even").css('background', 'rgb(238,238,238)');
		
			$dialog.dialog({
				title: Liferay.Language.get('query-history'),
				width:800,
				modal: true,
				buttons:[{
					text: Liferay.Language.get('ok'),
					click: function(){
						$(this).dialog('destroy');
					}
				}]
			});
		}
	}

	class Portlet{
		#portletName;
		#instanceId;

		constructor( portletName, generateInstanceId=true ){
			this.portletName = portletName;
			if( generateInstanceId ){
				this.instanceId = Util.randomString(10, 'aA1');
			}
		}

		get portletName(){return this.#portletName;}
		set portletName(portletName){this.#portletName=portletName;}
		get instanceId(){return this.#instanceId;}
		set instanceId(id){this.#instanceId = id;}
		get namespace(){
				return '_'+this.portletId+'_';
		}
		get portletId(){
			if( this.#instanceId ){
				return this.portletName+'_INSTANCE_'+this.instanceId;
			}
			else{
				return this.portletName;
			}
		}
	}

	class EventDataPacket{
		constructor( sourcePortlet, targetPortlet ){
			this.sourcePortlet = sourcePortlet;
			this.targetPortlet = targetPortlet;
		}

		isTargetPortlet(ns){
			return this.targetPortlet === ns;
		}

		parse( jsonObj ){
			Object.keys(jsonObj).forEach( key => {
				this[key] = jsonObj[key];
			});
		}

		toJSON(){
			let json = new Object();

			for(let key in this){
				json[key] = this[key];
			};

			return json;
		}
	}

	class Visualizer {
        #menus;
        #namespace;
        #portletId;
        #resourceURL;
        #employer;
        #eventHandlers;
		#loadCanvasFunc;
		#canvas;
		#menuOptions;
		#disabled;
		#initData;
		#lastRecvPacket;
		#lastSentPacket;
		#content;
		#baseFolder;
		#procFuncs;
		#attachedEventHandlers;
		#fileExplorerId;
		#fileExplorerDialog;

		/*
        get menus(){
            return this.#menus;
        }

        set menus( val ){
            this.#menus = val;
        }
		*/
        get portletId(){return this.#portletId;}
        set portletId( portletId ){this.#portletId = portletId;}
		get namespace(){return this.#namespace;}
		set namespace( ns ){this.#namespace = ns;}
		get canvas(){return this.#canvas;}
		set canvas( canvasTag ){this.#canvas = canvasTag;}
		get disabled(){return this.#disabled;}
		set disabled( disabled ){this.#disabled = disabled;}
		get employer(){return this.#employer;}
		set employer( employer ){this.#employer = employer;}
		get lastRecvPacket(){ return this.#lastRecvPacket; }
		set lastRecvPacket(lastRecvPacket){ this.#lastRecvPacket = lastRecvPacket; }
		get lastSentPacket(){ return this.#lastSentPacket; }
		set lastSentPacket(lastSentPacket){ this.#lastSentPacket = lastSentPacket; }
		get content(){ return this.#content; }
		set content(content){ this.#content = content; }
		get resourceURL(){ return this.#resourceURL; }
		set resourceURL(resourceURL){ this.#resourceURL = resourceURL; }

        constructor( config ){
			
            this.portletId = config.portletId;
            this.namespace  = config.namespace;
            this.resourceURL = config.resourceURL;
            this.employer = config.employer;
            this.#eventHandlers = config.eventHandlers;
    
            this.#loadCanvasFunc = config.loadCanvas;
            this.canvas = config.displayCanvas;
            this.menuOptions = config.menuOptions;
            
            this.disabled = config.disabled;
            this.initData = undefined;
    
            this.lastRecvPacket = undefined;
            this.lastSentPacket = undefined;
            this.content = undefined;
            this.baseFolder = '';
            this.#procFuncs = {};
    
            this.#attachedEventHandlers = {};
            this.#fileExplorerId = '';
            this.#fileExplorerDialog = '';

            //Add custom proc funcs
            for( let funcName in config.procFuncs ){
                this.#procFuncs[funcName] = config.procFuncs[funcName];
            }
           
            //Set currentData and baseFolder if initData exists
            if( !$.isEmptyObject(this.#initData) ){
                this.setBaseFolderAndCurrentData();
            }

            //Hides un-needed menu
            if( !$.isEmptyObject(this.#menuOptions ) ){
                if( !this.#menuOptions.menu ){
					$('#'+this.#namespace+'menu').remove();
				}
				else{
					if( !this.#menuOptions.sample )         $('#'+this.#namespace+'sample').remove();
					if( !this.#menuOptions.download )       $('#'+this.#namespace+'download').remove();
					if( !this.#menuOptions.openLocalFile )  $('#'+this.#namespace+'openLocalFile').remove();
					if( !this.#menuOptions.openServerFile ) $('#'+this.#namespace+'openServerFile').remove();
					if( !this.#menuOptions.saveAsLocalFile )    $('#'+this.#namespace+'saveAsLocalFile').remove();
					if( !this.#menuOptions.saveAsServerFile )	$('#'+this.#namespace+'saveAsServerFile').remove();
					if( !this.#menuOptions.saveAsDBRecord )	$('#'+this.#namespace+'saveAsDBRecord').remove();
				}
                
            }

            // Set namespace on iframe if canvas is iframe
            
            if( this.#canvas.tagName.toLowerCase() === 'iframe' ){
                console.log('Visualizer setNamespace!!', this.#canvas );
                if(this.#canvas.contentWindow['setNamespace']){
                    this.#canvas.contentWindow['setNamespace']( this.#namespace );
                }else{
					let self = this;
					let count = 0;
                    setTimeout(function(){
						console.log( 'Try to set namespace: ' + ++count );
                        self.#canvas.contentWindow['setNamespace']( self.#namespace );
                    }, 500)
                }
                
                if( this.#disabled )
                	this.#canvas.contentWindow['disable']( this.#disabled );
            }

            this.#attachEventHandlers();

            //Attach default proc functions
            this.#procFuncs.readServerFile = this.readServerFile;
            this.#procFuncs.saveAtServerAs = this.saveAtServerAs;
            this.#procFuncs.readServerFileURL = this.readServerFileURL;

            /**
             * The following block will be enabled after SX_HANDSHAKE event is deprecated.  
             *  
            if( connector ){
                let events = [];
                for( let event in attachedEventHandlers ){
                    events.push( event );
                }
                console.log('--------------------------', events);
                fireRegisterEventsEvent( events, {} );
            }
            */
            /*	SDE Mandatory Check Event	*/

        }

        getPortletSection(){
            let portlet = $('#p_p_id'+this.namespace);
            if( !portlet[0] ){
                portlet = $('#'+this.namespace).parent();
            }

            //portlet = $('#workbench-layout-area');
            return portlet;
        }

        blockVisualizer(){
            let portlet = this.getPortletSection();

            if( !portlet[0] ){
                console.log( 'There is no portlet section for '+this.#namespace);
                return;
            }

            console.log( 'blockVisualizer portlets: ', portlet)
            let offset = portlet.offset();
            console.log('Block visualizer: '+ this.namespace, offset, portlet.width(), portlet.height() );
            portlet.addClass("loading-animation loading-custom");
        }

        unblockVisualizer(){
            console.log('Unblock visualizer: '+this.namespace);
            let portlet = this.getPortletSection();
            if( !portlet[0] ){
                return;
            }
            portlet.removeClass("loading-animation loading-custom");
//            portlet.unblock();
        }

        showAlert( msg ){
            let dialog = $('<div></div>');
            dialog.text(msg);
            dialog.dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    'OK': function(){
                        dialog.dialog( 'destroy' );
                    }
                }
            });
        }

        createFormData( jsonData ){
            let formData = new FormData();
            for( let key in jsonData ){
                formData.append( NAMESPACE+key, jsonData[key] );
            }

            return formData;
        }

        openServerFileExplorer( procFuncName, changeAlert ){
        	AUI().use("liferay-portlet-url", function(a){
        		// set portlet & popup properties
        		let portletURL = Liferay.PortletURL.createRenderURL();
        		portletURL.setPortletMode("view");
        		portletURL.setWindowState("pop_up");
        		portletURL.setPortletId("OSPIcecle_web_icecle_personal_OSPDrivePortlet");
        		
        		// set parameters to portletURL
        		portletURL.setParameter('connector', this.portletId);
        		portletURL.setParameter('disabled', false);
                portletURL.setParameter('repositoryType',this.currentData.repositoryType());
                portletURL.setParameter('isPopup', true);
                
                // open modal
                Liferay.Util.openWindow(
            			{
            				dialog: {
            					width:1024,
            					height:900,
            					cache: false,
            					draggable: false,
            					resizable: false,
            					modal: true,
            					centered : true,
            					destroyOnClose: true,
            					cssClass: 'modal-xl modal-position-over',
            					after: {
            						render: function(event) {
            							$('#' + 'myDriveDialogModal').css("z-index", "1500");
            						},
            					},
            					toolbars: {
		            				footer: [
			            				{
			            					label : 'Confirm',
			            					cssClass: 'btn-primary',
			            					on: {
			            						click : function(){
			            							getSelectedFileInfo();
			            						}
			            					}
			            				},
			            				{
			            					label: 'Close',
			            					cssClass: 'btn-default',
			            					on : {
			            						click : function(){
			            							closePopup();
			            						}
			            					}
			            				}
		            				]
            					}
            				},
            				id: "myDriveDialogModal",
            				uri: portletURL.toString(),
            				title: "Open Server File"
            			}
            		);
        	});
        	
        	Liferay.provide(window, 'closePopup', function(){
        		Liferay.Util.getWindow("myDriveDialogModal").destroy();
        	},['liferay-util-window']);
        	
        	Liferay.provide(window, 'getSelectedFileInfo', function(){
        		let contentWindow = Liferay.Util.getWindow("myDriveDialogModal").iframe.node._node.contentWindow;
        		let selectedLi = $(contentWindow.document).find(contentWindow.DRIVE_LIST_BODY + " li.ui-selected");
        		if(selectedLi.length > 0){
        			let selectedFilePath = $(selectedLi).data('resourcePath');
        			let fileInfoStr = selectedFilePath.split("\\");
        			
        			let fileInfoObj = {};
        			fileInfoObj.type = Enumeration.PathType.FILE;
        			let parentStr = "";
        			fileInfoStr.forEach(function(eachStr, i){
        				if( i < fileInfoStr.length -1 ){
        					parentStr += eachStr+"/";
        				}else{
        					fileInfoObj.name = eachStr;
        				}
        			});
        			fileInfoObj.repositoryType_ = 'USER_DRIVE';
        			fileInfoObj.parent = parentStr;
        			this.loadCanvas( fileInfoObj, changeAlert );
        			Liferay.Util.getWindow("myDriveDialogModal").destroy();
        		}else{
        			toastr.error('Please select file.', {timeout:3000});
        			return false;
        		}
        	},['liferay-util-window']);
        }

        readServerFile( jsonData, changeAlert ){
            if( jsonData ){
                this.content = jsonData;
            }
            let params = {
                command:'READ_FILE',
            };
            let formData = this.createFormData( params );

            $.ajax({
                url : resourceURL,
                type : 'POST',
                data : formData,
                dataType:'text',
                global : false,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: this.blockVisualizer,
                success : function(data) {
                    // console.log( 'currentData after readFile: ', currentData );
                        let result = {
                            type: Enumeration.PathType.FILE_CONTENT,
                            content_: data
                        };
                        loadCanvas( result, changeAlert );
                },
                error: function(data, e ){
                    console.log('Error read server file: ', jsonData, data, e);
                },
                complete: this.unblockVisualizer
            });
        }

        readServerFileURL( jsonData, changeAlert ){
        	if( jsonData ){
                this.content = jsonData;
            }
            this.createURL('READ_FILE', changeAlert);
        }

        readDataTypeStructure( name, version, changeAlert ){
            let params = {
                command: 'READ_DATATYPE_STRUCTURE',
                dataTypeName: name,
                dataTypeVersion: version
            };

            let formData = this.createFormData( params );

            $.ajax({
                url : this.resourceURL,
                type : 'POST',
                data : formData,
                dataType:'json',
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: blockVisualizer,
                global : false,
                async:false,
                success : function(data) {
                       // console.log( 'currentData after readFile: ', currentData );
                       if( data.error ){
                           console.log( data.error );
                           return;
                       }
                        let result = {
                            type: Enumeration.PathType.STRUCTURED_DATA,
                            dataType_:{
                                name: data.dataTypeName,
                                version:data.dataTypeVersion
                            },
                            content_:JSON.parse( data.structuredData )
                        };
                        this.content = result;

                        this.loadCanvas( Util.toJSON(currentData, changeAlert) );
                },
                error: function(data, e ){
                    console.log('Error read first server file name: ', jsonData, data, e);
                },
                complete: this.unblockVisualizer
            });
        }

        getFirstFileName = function( successFunc ){
            let params = {
                command:'GET_FIRST_FILE_NAME',
                repositoryType: baseFolder.repositoryType(),
                userScreenName: currentData.user(),
                dataType: currentData.dataType(),
                pathType: baseFolder.type(),
                parentPath: currentData.parent()
            };

            Debug.eventTrace('getFirstFileName()', 'Params', params);

            if( baseFolder.type() === Enum.PathType.EXT){
                params.fileName = baseFolder.name();
            }

            let formData = this.createFormData( params );

            $.ajax({
                url : this.resourceURL,
                type : 'POST',
                data : formData,
                dataType:'json',
                global : false,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: this.blockVisualizer,
                success : function(data) {
                       console.log( 'currentData after readFile: ', data );
                       if( data.result === 'no-file' ){
                           return;
                       }

                        let result = {
                            type: Constants.PathType.FILE,
                            parent: data.parentPath,
                            name:data.fileName
                        };
                        Debug.eventTrace('result of getFirstFileName', data, result);
                        this.setCurrentData( result );

                        successFunc();
                        //loadCanvas( Util.toJSON(currentData), false);
                },
                error: function(data, e ){
                    console.log('Error read first server file name ( function name : getFirstFileName ) : ', data, e);
                },
                complete: this.unblockVisualizer
            });
        }

        readFirstServerFile( jsonData, changeAlert ){
            if( jsonData ){
                this.setCurrentData( jsonData );
            }

            let successFunc = function(){
                this.loadCanvas( Util.toJSON(this.currentData), changeAlert );
            };

            this.getFirstFileName( successFunc );
        }

        readFirstServerFileURL( jsonData, changeAlert ){
            if( jsonData ){
                 this.setCurrentData( jsonData );
            }

             let successFunc = function(){
                this.createURL('READ_FILE', changeAlert);
            };

            this.getFirstFileName( successFunc, changeAlert );
        }

        refreshFileExplorer(){

            let eventData = {
                        portletId: this.portletId,
                        targetPortlet: this.fileExplorerId,
                        data: {
                                repositoryType_: this.baseFolder.type(),
                                user_: this.currentData.user(),
                                type: Constants.PathType.FILE,
                                parent: this.currentData.parent(),
                                name: this.currentData.name()
                        },
                        params:{
                            changeAlert:false
                        }
            };
            Liferay.fire(Events.SX_LOAD_DATA, eventData );
        }

        refresh(){
            Liferay.Portlet.refresh('#p_p_id'+this.namespace);
        }

        saveAtServerAs( folderPath, fileName, content ){
            let saveData = {
                command: 'SAVE',
                repositoryType: this.baseFolder.repositoryType(),
                userScreenName: this.currentData.user(),
                dataType: this.currentData.dataType(),
                pathType: this.currentData.type(),
                parentPath: folderPath,
                fileName: fileName,
                content: content
            };
            let formData = this.createFormData( saveData );

             $.ajax({
                url : this.resourceURL,
                type : 'POST',
                data : formData,
                dataType:'text',
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                global : false,
                beforeSend: this.blockVisualizer,
                success : function(data) {
                    this.currentData.parent( folderPath );
                    this.currentData.name(fileName);
                    this.currentData.content(content);
                    this.currentData.dirty( false );
                },
                error: function(data, e ){
                    console.log('Error read file: ', data, e);
                },
                complete: this.unblockVisualizer
            });
        }

        runProcFuncs( func ){
            let args = Array.prototype.slice.call(arguments);
            console.log('runProcFuncs: ', args);
            let newArgs = [];
            let funcName = args[0];
            for (let i = 1; i < args.length; i++) {
                newArgs.push(args[i]);
            }

            this.#procFuncs[funcName].apply(null, newArgs);
        }

        callIframeFunc(funcName, resultProcFunc ){
            let args = Array.prototype.slice.call(arguments);
            let stripedArgs = [];
            for (let i = 2; i < args.length; i++) {
                stripedArgs.push(args[i]);
            }
            let result = this.canvas.contentWindow[funcName].apply(this.canvas.contentWindow, stripedArgs);
            if( resultProcFunc ){
                resultProcFunc( result );
            }
        }

        readDLFileEntry( changeAlert ){
            let params = {
                command:'READ_DLENTRY',
                dlEntryId: this.currentData.content()
            };

            let formData = this.createFormData( params );
            
			let visualizer = this;
            $.ajax({
                url : visualizer.resourceURL,
                type : 'POST',
                data : formData,
                dataType:'json',
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: visualizer.blockVisualizer,
                success : function(result) {
                    let jsonData = {
                        type: Constants.PathType.CONTENT,
                        content_: result
                    };
                    visualizer.content( jsonData );
                    visualizer.loadCanvas( Util.toJSON(currentData), changeAlert );
                },
                error: function(data, e ){
                    visualizer.errorFunc(data, e);
                },
                complete: visualizer.unblockVisualizer
            });
        }

        readDLFileEntryURL = function(changeAlert){
            this.createURL('READ_DLENTRY', changeAlert);
        }
        
        deleteFile( fileName, parentPath, successFunc ){
        	let params = {
                command: 'DELETE',
                repositoryType: this.baseFolder.repositoryType(),
                parentPath: parentPath,
                fileName: fileName
            };
            let formData = this.createFormData( params );
            $.ajax({
                url : this.resourceURL,
                type : 'POST',
                data : formData,
                dataType:'json',
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: this.blockVisualizer,
                success : function(data) {
                        //currentData.deserialize( data );
                        this.currentData.type( Constants.PathType.FILE );
                        successFunc(data);
                },
                complete: this.unblockVisualizer
            });
        }
        
        submitUpload( localFile, successFunc ){
            let params = {
                command: 'UPLOAD',
                uploadFile: localFile,
                repositoryType: this.baseFolder.repositoryType(),
                parentPath: this.currentData.parent(),
                fileName: this.currentData.name()
            };
            let formData = this.createFormData( params );
            $.ajax({
                url : this.resourceURL,
                type : 'POST',
                data : formData,
                dataType:'json',
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: this.blockVisualizer,
                success : function(data) {
                        //currentData.deserialize( data );
                        this.currentData.type( Constants.PathType.FILE );
                        successFunc(data);
                },
                complete: this.unblockVisualizer
            });
        }
        
        showFileUploadConfirmDialog( localFile, targetFileName, successFunc){
            let dialogDom = 
                    '<div id="' + this.namespace + 'confirmDialog">' +
                        '<input type="text" id="' + this.namespace + 'targetFilePath" class="form-control"/><br/>' +
                        '<p id="' + this.namespace + 'confirmMessage">' +
                        'File already exists. Change file name or just click "OK" button to overlap.' +
                        '</p>' +
                    '</div>';
            let dialog = $(dialogDom);
            dialog.find( '#'+this.namespace+'targetFilePath').val(Util.mergePath(this.currentData.parent(), targetFileName));
            dialog.dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    'OK': function(){
                        let targetPath = dialog.find( '#'+this.namespace+'targetFilePath').val();
                        let path = Util.convertToPath( targetPath );
                        this.currentData.parent(path.parent);
                        this.currentData.name(path.name);
                        this.submitUpload( localFile, successFunc );
                        dialog.dialog( 'destroy' );
                    },
                    'Cancel': function() {
                        dialog.dialog( 'destroy' );
                    }
                }
            });
        }
        
        uploadFile( localFile, targetFileName, successFunc ){
            let formData = new FormData();
            formData.append(this.namespace+'command', 'CHECK_DUPLICATED');
            formData.append(this.namespace+'repositoryType', this.baseFolder.repositoryType());
            formData.append(this.namespace+'userScreenName', this.currentData.user());
            formData.append(this.namespace+'target', Util.mergePath(this.currentData.parent(), targetFileName));
            
            $.ajax({
                    url: this.resourceURL,
                    type: 'POST',
                    dataType: 'json',
                    data:formData,
                    processData: false,
                    contentType: false,
                    beforeSend: this.blockVisualizer,
                    success: function( result ){
                        if( result.duplicated ){
                            this.showFileUploadConfirmDialog( localFile, targetFileName, successFunc );
                        }
                        else{
                            this.currentData.name( targetFileName );
                            this.submitUpload( localFile, successFunc);
                        }
                    },
                    error: function( data, e ){
                        console.log( 'checkDuplicated error: ', data, e);
                    },
                    complete: this.unblockVisualizer
            });
        }

        createURL( command, changeAlert ){
            AUI().use('liferay-portlet-url', function(A) {
                let serveResourceURL;
                serveResourceURL = Liferay.PortletURL.createResourceURL();
                serveResourceURL.setPortletId(this.portletId);
                serveResourceURL.setParameter('repositoryType', this.currentData.repositoryType());
                serveResourceURL.setParameter('userScreenName', this.currentData.user());
                serveResourceURL.setParameter('parentPath', this.currentData.parent());
                serveResourceURL.setParameter('pathType', this.currentData.type());
                serveResourceURL.setParameter('fileName', this.currentData.name());
                serveResourceURL.setParameter('command', command);

                let jsonData = {
                    type: Constants.PathType.URL,
                    content_: this.serveResourceURL.toString()
                };

                this.content = jsonData;
                this.loadCanvas( Util.toJSON(this.currentData), changeAlert);
            });
        }

        downloadFiles( fileNames ){
            if( fileNames.length < 1 ){
                showAlert('Must select one or more files to download!' ); 
                return;
            }
//            window.location.href = createURL('DOWNLOAD');
            let separator = (this.resourceURL.indexOf('?') > -1) ? '&' : '?';
            let data = {};
            data[this.namespace+'command'] = Constants.Commands.DOWNLOAD;
            data[this.namespace+'repositoryType'] = this.baseFolder.repositoryType();
            data[this.namespace+'userScreenName'] = this.currentData.user();
            data[this.namespace+'parentPath'] = this.currentData.parent();
            data[this.namespace+'fileNames'] = JSON.stringify(fileNames);

            let url = resourceURL + separator + $.param(data);
            
            window.location.href = url;
        }

        #attachEventHandler( event, handler ){
            if( this.#attachedEventHandlers.hasOwnProperty(event) ){
                Liferay.detach( event, this.#attachedEventHandlers[event] );
				delete this.#attachedEventHandlers[event];
            }

			let visualizer = this;
			this.#attachedEventHandlers[event] = function( e ){
				let packet = e.dataPacket;
				if( packet.targetPortlet !== visualizer.namespace ) return;
					
				visualizer.lastRecvPacket = packet;
				handler( packet );
			};

			Liferay.on( event, this.#attachedEventHandlers[event] );
        }

        setBaseFolderAndCurrentData(){
            this.content = new InputData( this.#initData );
            this.#baseFolder = new InputData();

            for( let key in this.#initData ){
                switch( key ){
                    case Constants.TYPE:
                        if( this.#initData[key] !== Constants.PathType.FOLDER && 
                            this.#initData[key] !== Constants.PathType.EXT ){
                            this.#baseFolder.type( Constants.PathType.FOLDER );
                        }
                        else{
                            this.#baseFolder.type( this.#initData[key] );
                        }
                        break;
                    default:
                        this.#baseFolder[key] = this.#initData[key];
                        break;
                }
            }

            if( !this.#baseFolder.repositoryType() ){
                console.log('[WARNING] Portlet '+this.#portletId+' baseFolder has no repositoryType!');
            }

        }

        #attachEventHandlers(){
            for( let event in this.#eventHandlers ){
                this.#attachEventHandler( event, this.#eventHandlers[event]);
            }
        }

        createEventDataPacket( payloadType, payload ){
			let dataPacket = Util.createEventDataPacket( this.namespace, this.employer );

			dataPacket.payloadType = payloadType;
			dataPacket.payload = payload;

            return dataPacket;
        }

		fireVisualizerWaitingEvent( payload ){
			let dataPacket = this.createEventDataPacket( Constants.PayloadType.WARNING, payload );
			this.lastSentPacket = dataPacket;
			
			Util.fire(Events.SX_VISUALIZER_WAITING, dataPacket);
		}

		fireVisualizerReadyEvent( payload ){
			let dataPacket = this.createEventDataPacket( Constants.PayloadType.VISUALIZER_READY, payload );
			this.lastSentPacket = dataPacket;
			
			Util.fire(Events.SX_VISUALIZER_READY, dataPacket);
		}

        fireMadatoryCheckEvent(){
            let isPassed = Liferay.fire( Constants.Event.SX_CHECK_MANDATORY, {targetPortlet : this.portletId});
            return isPassed;
        }

        fireRegisterEventsEvent( data, params ){
            // console.log( '++++ EventData: ', createEventData(data, params ));
            Liferay.fire( Events.SX_REGISTER_EVENTS, this.createEventData(data, params ));
        }

        fireVisualizerDataChangedEvent( payloadType, payload ){
			let dataPacket = this.createEventDataPacket( payloadType, payload );
			this.lastSentPacket = dataPacket;

            Util.fire( Events.SX_VISUALIZER_DATA_CHANGED, dataPacket );
        }

		fireVisualizerDataLoadedEvent( payloadType, payload ){
			let dataPacket = this.createEventDataPacket( payloadType, payload );
			this.lastSentPacket = dataPacket;

            Util.fire( Events.SX_VISUALIZER_DATA_LOADED, dataPacket );
        }

        
        /* Strucutred Data's Port type check */
        checkInputPortsType(data) {
        	let inputsType = data[Constants.TYPE];
        	if(inputsType === Constants.PathType.FILE_CONTENTS) {
        		let fileContents = data[Constants.CONTENT];
        		if( fileContents.fileCount === 1 ) {
        			data[Constants.TYPE] = Constants.PathType.FILE_CONTENT
        			data[Constants.CONTENT] = ( fileContents.content[0].join('') );
        		}
        	}
        }

        fireSampleSelectedEvent( data, params ){
            Liferay.fire( Events.SX_SAMPLE_SELECTED, this.createEventData(data, params) );
        }

        fireRequestSampleContentEvent( data, params ){
            console.log("sampleFileRead")
            console.log(this.createEventData(data, params))
        	Liferay.fire( Events.SX_REQUEST_SAMPLE_CONTENT, this.createEventData(data, params) );
        }

        fireRequestSampleURL( data, params ){
            Liferay.fire( Events.SX_REQUEST_SAMPLE_URL, this.createEventData(data, params) );
        }

        fireRequestDataEvent( targetPortlet, data, params ){
            let eventData = {
                portletId: this.portletId,
                targetPortlet: targetPortlet,
                data: data,
                params: params
            };

            Liferay.fire( Events.SX_REQUEST_DATA, eventData );
        }

        fireResponseDataEvent( jsonData, params ){
            console.log('Fire response data event: ', jsonData, params );
            
            Liferay.fire( Events.SX_RESPONSE_DATA, this.createEventData( jsonData, params ) );
        }

        openHtmlIndex( jsonData, changeAlert ){
            console.log('openHtmlIndex: ', jsonData, changeAlert);
            if( jsonData ){
                this.content = jsonData;
            }

            let params = {
                command: 'READ_HTML_INDEX_URL',
                repositoryType: this.baseFolder.repositoryType(),
                userScreenName: this.currentData.user(),
                pathType: Constants.PathType.FILE,
                parentPath: this.currentData.parent(),
                fileName: this.currentData.name()
            };

            let formData = this.createFormData( params );

            $.ajax({
                type: 'POST',
                url: this.resourceURL, 
                data  : formData,
                dataType : 'json',
                processData: false,
                contentType: false,
                beforeSend: this.blockVisualizer,
                success: function(result) {
                    let jsonData = {
                        type: Constants.PathType.URL,
                        content:  Util.mergePath( result.parentPath, result.fileName),
                        fileType: result.fileType
                    };
                    this.loadCanvas( jsonData, changeAlert );
                    //successFunc( data.parentPath, data.fileInfos );
                },
                error:function(ed, e){
                    console.log('Cannot openHtmlIndex', params, ed, e);
                },
                complete: this.unblockVisualizer
            }); 
        }

        getCopiedTempFilePath(contextPath, jsonData, changeAlert){
            if( jsonData ){
                this.content = jsonData;
            }

            let params = {
                command: Constants.Commands.SX_GET_COPIED_TEMP_FILE_PATH,
            };

            let formData = this.createFormData( params );

            $.ajax({
                type: 'POST',
                url: this.resourceURL, 
                data  : formData,
                dataType : 'json',
                processData: false,
                contentType: false,
                beforeSend: this.blockVisualizer,
                success: function(result) {
                    let jsonData = {
                        type: Constants.PathType.URL,
                        content: contextPath+'/'+Util.mergePath( result.parentPath, result.fileName ),
                        fileType: result.fileType
                    };
                    this.loadCanvas( jsonData, changeAlert );
                    //successFunc( data.parentPath, data.fileInfos );
                },
                error:function(ed, e){
                    console.log('Cannot openHtmlIndex', params, ed, e);
                },
                complete: this.unblockVisualizer
            }); 
        }

        openLocalFile( contentType, changeAlert ){
            console.log('Open Local File');
            let domFileSelector = $('<input type=\"file\" id=\"'+NAMESPACE+'selectFile\"/>');
            domFileSelector.click();
            domFileSelector.on(
                'change',
                function(event){
                    let reader = new FileReader();
                    let fileName = Util.getLocalFileName(this);
                    let file = Util.getLocalFile( this );
                    switch( contentType ){
                        case 'url':
                            reader.readAsDataURL(file);
                            break;
                        default:
                            reader.readAsText(file);
                            break;
                    }
                    reader.onload = function (evt) {
                        let result = {};
                        switch(contentType){
                            case 'url':
                                result.type = Constants.PathType.URL;
                                break;
                            default:
                                result.type = Constants.PathType.CONTENT;
                                break;
                        }
                        result.name = fileName;
                        result.content_ = evt.target.result;
                        this.loadCanvas(result, changeAlert);
                    };
                }
            );
        }

        saveAtServer = function(content){
            switch( this.currentData.type() ){
                case Constants.PathType.FILE_CONTENT:
                case Constants.PathType.FILE:
                    this.saveAtServerAs( this.currentData.parent(), this.currentData.name(), content );
                    break;
                default:
                    this.openServerFileExplorer('saveAtServerAs');
                    break;
            }
        }

        saveAtLocal( content, contentType ){
            let a = document.createElement("a");

            if( !contentType ){
                contentType = 'text/plain';
            }
            let file = new Blob([content], {type: contentType});
            a.href = URL.createObjectURL(file);
            a.download = this.currentData.name();
            a.click();
        }

        uploadLocalFile( successFunc ){
            let domFileSelector = $('<input type=\"file\"/>');
            domFileSelector.click();
            domFileSelector.on(
                'change',
                function(event){
                    let localFile = Util.getLocalFile( this );
                    let defaultTargetFileName = Util.getLocalFileName( this );
                    this.uploadFile( localFile,  defaultTargetFileName, successFunc );
                }
            );
        }

        getFolderInfo( folderPath, extension, changeAlert){
            let params = {};
            params.command = Constants.Commands.SX_GET_FILE_INFO;
            params.repositoryType = this.baseFolder.repositoryType();
            params.userScreenName = this.currentData.user();
            params.parentPath = folderPath;

            if( this.baseFolder.type() === Constants.PathType.EXT ){
                params.pathType = Constants.PathType.EXT;
                params.fileName = extension;
            }
            else{
                params.pathType = Constants.PathType.FOLDER;
            }
            
            let formData = this.createFormData( params );

           $.ajax({
                type: 'POST',
                url: this.resourceURL, 
                data  : formData,
                dataType : 'json',
                processData: false,
                global : false,
                contentType: false,
//                beforeSend: blockVisualizer,
                success: function(data) {
                    let jsonData = {
                        type: Constants.PathType.FOLDER_CONTENT,
                        parent: data.parentPath,
                        name: currentData.name(), 
                        content: data.fileInfos
                    };
                    this.loadCanvas( jsonData, changeAlert );
                    //successFunc( data.parentPath, data.fileInfos );
                },
                error:function(ed, e){
                    console.log('Cannot lookup directory', params, ed, e);
                },
                complete: this.unblockVisualizer
            });
        }


        loadCanvas( content ){
        	this.content = content;
            this.#loadCanvasFunc( this.content );
        }

        downloadResultFile(){
        	let sendData = Liferay.Util.ns(this.namespace, {
        	});
        	
        	$.ajax({
        		url : this.resourceURL,
        		data : sendData,
        		dataType : 'json',
        		error : function(err){
        			toastr.error('Result file download fail...');
        		},
        		success : function(result){
        			window.open(result.apiURL);
        		}
        	});
        }

        downloadCurrentFile( contextPath, requestType ){
        	let downloadType = requestType || this.currentData.type();
        	
            switch( downloadType ){
                case Constants.PathType.FILE:
                case Constants.PathType.FILE_CONTENT:
                    let fileNames = [this.currentData.name()];
                    this.downloadFiles( fileNames);
                    break;
                case Constants.PathType.CONTENT:
                	let downloadFileName = this.currentData.name() || 'textFile.txt'; 
                	
                	let textFileAsBlob = new Blob([this.currentData.content()], {type:'text/plain'}); 
                	let downloadLink = document.createElement("a");
                	downloadLink.download = downloadFileName;
                	downloadLink.innerHTML = "Download File";
                	if (window.webkitURL != null){// Chrome
                		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
                	}else{// Firefox
                		downloadLink.href = window.URL.createObjectURL();
                		downloadLink.onclick = destroyClickedElement;
                		downloadLink.style.display = "none";
                		document.body.appendChild(downloadLink);
                	}
                
                	downloadLink.click();
                	break;
                case Constants.PathType.URL:
                    if( contextPath ){
//                        window.location.href = contextPath+this.currentData.content();
                    }
                    else{
                    	let downloadContent = this.currentData.content();
                    	
                    	if(downloadContent.indexOf('data') == 0){
                        	let base64Code = downloadContent.substring(downloadContent.indexOf(',')+1);

                        	let preData = downloadContent.substring(0, downloadContent.indexOf(','));
                        	let contentType = preData.substring(preData.indexOf(':')+1, preData.indexOf(';'));
                        	/*
                        	 * base64Code -> Blob
                        	 */
                        	let byteCharacters = atob(base64Code);
                        	let byteArrays = [];
                        	for(let offset = 0 ; offset < byteCharacters.length ; offset += 512){
                        		let slice = byteCharacters.slice(offset, offset + 512);
                        		
                        		let byteNumbers = new Array(512);
                        		for(let i = 0 ; i < slice.length ; i++){
                        			byteNumbers[i] = slice.charCodeAt(i);
                        		}
                        		let byteArray = new Uint8Array(byteNumbers);
                        		byteArrays.push(byteArray);
                        	}
                        	
                        	let blob = new Blob(byteArrays, {type : contentType});
                        	if(window.navigator.msSaveOrOpenBlob){
                        		window.navigator.msSaveBlob(blob, this.currentData.name());
                        	}else{
                        		let aTag = window.document.createElement("a");
                        		
                        		aTag.href = window.URL.createObjectURL(blob, {
                        			type : contentType
                        		});
                        		aTag.download = this.currentData.name();
                        		document.body.appendChild(aTag);
                        		aTag.click();
                        		document.body.removeChild(aTag);
                        	}
                    	}else{
                    		let fileNames = [this.currentData.name()];
                            downloadFiles( fileNames);
                    	}
                    }
                    break;
            }
        }
        
        openServerFile( procFuncName, changeAlert ){
                if( procFuncName )
                    this.openServerFileExplorer( procFuncName, changeAlert );
                else
                    this.openServerFileExplorer( 'readServerFile', changeAlert );
        }

        processInitAction( jsonData, launchCanvas, changeAlert ){
        	if( jsonData ){
                initData = jsonData;
                initData.type = jsonData.type ? jsonData.type : Constants.PathType.FOLDER;
                initData.parent = jsonData.parent ? jsonData.parent : '';
                initData.name = jsonData.name ? jsonData.name : '';
            }
            
            this.setBaseFolderAndCurrentData();
            // console.log( 'After processInitAction: ', currentData );
            if( launchCanvas ){
                this.loadCanvas( Util.toJSON(currentData), changeAlert );
            }
        }

        configConnection( caller, disable ){
            this.connector = caller;
            this.disabled = disable;
        }

        setDisable( disable ){
            this.disabled = disable;
        }
        
        createTempFilePath( contextPath, jsonData, changeAlert, linked ){
           if( linked ){
               return this.getLinkedTempFilePath(contextPath, jsonData, changeAlert);
           }
           else{
               return this.getCopiedTempFilePath(contextPath, jsonData, changeAlert);
           }
        }

        isDirty(){
            return this.currentData.dirty();
        }

        openLocalFileURL( changeAlert ){
            this.openLocalFile('url', changeAlert);
        }

        openServerFileURL( changeAlert ){
            this.openServerFile( 'readServerFileURL', changeAlert);
        }

        saveAtServerAs( content ){
            if( content ){
                let jsonData = {
                    type: Constants.PathType.FILE_CONTENT,
                    content: content
                };

                this.content = jsonData;
            }
            
            this.openServerFileExplorer('saveAtServerAs');
        }
    }

	class Workbench {
		constructor(){

		}

		
	}

    return {
    	namespace: NAMESPACE,
    	defaultLanguage: DEFAULT_LANGUAGE,
    	availableLanguages: AVAILABLE_LANGUAGES,
    	LocalizationUtil: LocalizationUtil,
    	DataType: DataType,
    	newDataType: function(){
    		return new DataType();
    	},
    	DataStructure: DataStructure,
    	newDataStructure: function ( jsonStructure, profile, forWhat, $canvas ){
    		let dataStructure = new DataStructure( jsonStructure, profile, forWhat, $canvas );

			return dataStructure;
		},
    	Events: Events,
		Constants: Constants, 
    	TermTypes: TermTypes,
    	Term: Term,
    	newTerm: function( termType ){
    		if( !termType ){
    			return new StringTerm();
    		}
    		
    		switch( termType ){
	    		case TermTypes.STRING:
	    			return new StringTerm();
	    		case TermTypes.NUMERIC:
	    			return new NumericTerm();
	    		case TermTypes.LIST:
	    			return new ListTerm();
				case TermTypes.BOOLEAN:
					return new BooleanTerm();
	    		case TermTypes.EMAIL:
	    			return new EMailTerm();
	    		case TermTypes.ADDRESS:
	    			return new AddressTerm();
	    		case TermTypes.MATRIX:
	    			return new MatrixTerm();
	    		case TermTypes.PHONE:
	    			return new PhoneTerm();
	    		case TermTypes.DATE:
	    			return new DateTerm();
	    		case TermTypes.FILE:
	    			return new FileTerm();
	    		case TermTypes.GROUP:
	    			return new GroupTerm();
	    		default:
	    			return null;
    		}
    	},
		createEventDataPacket: function( sourcePortlet, targetPortlet ){
			return new EventDataPacket( sourcePortlet, targetPortlet );
		},
    	StringTerm: StringTerm,
    	NumericTerm: NumericTerm,
		ListTerm: ListTerm,
		BooleanTerm: BooleanTerm,
		GroupTerm: GroupTerm,
		FileTerm: FileTerm,
		DateTerm: DateTerm,
		MatrixTerm: MatrixTerm,
		FormUIUtil: FormUIUtil,
    	Util: Util,
		AdvancedSearch:AdvancedSearch,
		Workbench: Workbench,
		createVisualizer: function( config ){
			return new Visualizer( config );
		}
    };
};


