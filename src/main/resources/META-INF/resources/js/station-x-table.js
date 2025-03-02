let StationX = function ( NAMESPACE, DEFAULT_LANGUAGE, CURRENT_LANGUAGE, AVAILABLE_LANGUAGES ) {

	let MULTI_LANGUAGE = true;
	if( AVAILABLE_LANGUAGES.length < 2 ){
		MULTI_LANGUAGE = false;
	};
	
	let Util = {
		isEmptyArray: function(ary){
			return !ary || ary.length === 0;
		},
		isEmptyObject: function(obj){
			if( !obj )	return true;
			let keys = Object.keys(obj);
			if( keys.length === 0 )	return true;

			let self = this;
			let empty = true;
			keys.every(key=>{
				if( !obj[key] ){
					empty = true;
				}
				else if( typeof obj[key] === 'object' ){
					empty = self.isEmptyObject( obj[key] );
				}
				else if( typeof obj[key] === 'string' ){
					empty = self.isEmptyString(obj[key]);
				}
				return empty;
			});

			return empty;
		},
		isEmptyString: function(str){
			return !str || str === '';
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
					return SXConstants.STOP_EVERY;
				}

				return SXConstants.CONTINUE_EVERY;
			});

			return result;
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
	
	class DataType {
		static DEFAULT_HAS_DATA_STRUCTURE = false;
		static DEFAULT_SHOW_TOOLTIP = true;
		
		constructor( dataTypeName, dataTypeVersion ){
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
		LIST_ARRAY : 'ListArray',
		MATRIX : 'Matrix',
		FILE : 'File',
		FILE_ARRAY : 'FileArray',
		OBJECT : 'Object',
		OBJECT_ARRAY : 'ObjectArray',
		ARRAY : 'Array',
		DATA_LINK : 'DataLink',
		DATA_LINK_ARRAY : 'DataLinkArray',
		ADDRESS : 'Address',
		DATE : 'Date',
		PHONE : 'Phone',
		EMAIL : 'EMail',
		GROUP : 'Group',
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
			case 'Array':
				return new ArrayTerm( jsonTerm );
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
			case 'Object':
				return new ObjectTerm( jsonTerm );
			case 'ObjectArray':
				return new ObjectArrayTerm( jsonTerm );
			case 'File':
				return new FileTerm( jsonTerm );
			case 'FileArray':
				return new FileArrayTerm( jsonTerm );
			case 'DataLink':
				return new FileTerm( jsonTerm );
			case 'DataLinkArray':
				return new DataLinkArrayTerm( jsonTerm );
			case 'Comment':
				return new CommentTerm( jsonTerm );
			case 'Group':
				return new GroupTerm( jsonTerm );
			default:
				return new StringTerm( jsonTerm );
			}
		},

		TERM_TYPES : [ 
				'String',
				'Numeric',
				'Boolean',
				'List',
				'ListArray',
				'Matrix',
				'File',
				'FileArray',
				'Object',
				'ObjectArray',
				'Array',
				'DataLink',
				'DataLinkArray',
				'Address',
				'Date',
				'Phone',
				'EMail',
				'Group',
				'Comment'
			]
	};
	
	const TermAttributes = {
		 ABSTRACT_KEY: 'abstractKey',
		 ACTIVE : 'active',
		 AVAILABLE_LANGUAGE_IDS : 'availableLanguageIds',
		 COUNTRY_CODE : 'countryCode',
		 DATATYPE_NAME : 'dataTypeName',
		 DATATYPE_VERSION : 'dataTypeVersion',
		 DEFINITION : 'definition',
		 DEFAULT_LANGUAGE_ID : 'defaultLanguageId',
		 DEFAULT_LOCALE : 'defaultLocale',
		 DEPENDENT_TERMS : 'dependentTerms',
		 DIMENSION_X : 'dimensionX',
		 DIMENSION_Y : 'dimensionY',
		 DISABLED : 'disabled',
		 DISPLAY_NAME : 'displayName',
		 DISPLAY_STYLE : 'displayStyle',
		 DOWNLOADABLE : 'downloadable',
		 ELEMENT_TYPE : 'elementType',
		 FILE_ID : 'fileId',
		 FORMAT : 'format',
		 ID : 'id',
		 ITEM_DISPLAY_NAME : 'itemDisplayName',
		 LIST_ITEM : 'listItem',
		 LIST_ITEM_VALUE : 'listItemValue',
		 LIST_ITEMS : 'listItems',
		 MANDATORY : 'mandatory',
		 NAME : 'name',
		 MAX_BOUNDARY : 'maxBoundary',
		 MAX_LENGTH :'maxLength',
		 MAX_VALUE :'maxValue',
		 MIN_BOUNDARY : 'minBoundary',
		 MIN_LENGTH :'minLength',
		 MIN_VALUE :'minValue',
		 MULTIPLE_LINE :'multipleLine',
		 NUMERIC_PLACE_HOLDER : 'numericPlaceHolder',
		 OPTION_LABEL: 'optionLabel',
		 OPTION_VALUE: 'optionValue',
		 OPTION_SELECTED: 'optionSelected',
		 ORDER : 'order',
		 PATH : 'path',
		 PATH_TYPE : 'pathType',
		 PLACE_HOLDER : 'placeHolder',
		 RANGE : 'range',
		 REF_DATATYPES : 'refDataTypes',
		 REF_DATABASES : 'refDatabases',
		 SEARCHABLE: 'searchable',
		 SWEEPABLE : 'sweepable',
		 SYNONYMS : 'synonyms',
		 TERM_NAME : 'termName',
		 TERM_TYPE : 'termType',
		 TERM_VERSION : 'termVersion',
		 TEXT : 'text',
		 TOOLTIP : 'tooltip',
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

	const Constants = {
		Commands:{
			SX_DOWNLOAD: 'SX_DOWNLOAD',
			SX_DOWNLOAD_WITH_IB: 'SX_DOWNLOAD_WITH_IB',
			SX_GET_COPIED_TEMP_FILE_PATH: 'SX_GET_COPIED_TEMP_FILE_PATH',
			SX_GET_FILE_INFO: 'SX_GET_FILE_INFO'
		},
		PathType:{
			CONTENT: 'CONTENT',
			EXT: 'EXT',
			FILE: 'FILE',
			FILE_CONTENT: 'FILE_CONTENT',
			FOLDER: 'FOLDER',
			FOLDER_CONTENT: 'FOLDER_CONTENT',
			URL: 'URL'
		},
		RepositoryTypes:{
			USER_JOBS: 'USER_JOBS'
		},
		Events:{
			SX_CHECK_MANDATORY: 'SX_CHECK_MANDATORY',
			SX_DATA_CHANGED: 'SX_DATA_CHANGED',
			SX_DISABLE_CONTROLS: 'SX_DISABLE_CONTROLS',
			SX_EVENTS_REGISTERED: 'SX_EVENTS_REGISTERED',
			SX_HANDSHAKE: 'SX_HANDSHAKE',
			SX_REGISTER_EVENTS: 'SX_REGISTER_EVENTS',
			SX_RESPONSE_DATA: 'SX_RESPONSE_DATA',
			SX_REQUEST_DATA: 'SX_REQUEST_DATA',
			SX_REQUEST_SAMPLE_CONTENT: 'SX_REQUEST_SAMPLE_CONTENT',
			SX_REQUEST_SAMPLE_URL: 'SX_REQUEST_SAMPLE_URL',
			SX_SAMPLE_SELECTED:'SX_SAMPLE_SELECTED',
		},
		TermFields:{
			ACTIVE : 'active',
			AVAILABLE_LANGUAGE_IDS : 'availableLanguageIds',
			COUNTRY_CODE : 'countryCode',
			DATATYPE_NAME : 'dataTypeName',
			DATATYPE_VERSION : 'dataTypeVersion',
			DEFINITION : 'definition',
			DEFAULT_LANGUAGE_ID : 'defaultLanguageId',
			DEFAULT_LOCALE : 'defaultLocale',
			DEPENDENT_TERMS : 'dependentTerms',
			DIMENSION_X : 'dimensionX',
			DIMENSION_Y : 'dimensionY',
			DISABLED : 'disabled',
			DISPLAY_NAME : 'displayName',
			DISPLAY_STYLE : 'displayStyle',
			ELEMENT_TYPE : 'elementType',
			FILE_ID : 'fileId',
			FORMAT : 'format',
			ID : 'id',
			ITEM_DISPLAY_NAME : 'itemDisplayName',
			LIST_ITEM : 'listItem',
			LIST_ITEM_VALUE : 'listItemValue',
			LIST_ITEMS : 'listItems',
			MANDATORY : 'mandatory',
			NAME : 'name',
			MAX_BOUNDARY : 'maxBoundary',
			MAX_LENGTH :'maxLength',
			MAX_VALUE :'maxValue',
			MIN_BOUNDARY : 'minBoundary',
			MIN_LENGTH :'minLength',
			MIN_VALUE :'minValue',
			MULTIPLE_LINE :'multipleLine',
			OPTION_LABEL: 'optionLabel',
			OPTION_VALUE: 'optionValue',
			OPTION_SELECTED: 'optionSelected',
			ORDER : 'order',
			PATH : 'path',
			PATH_TYPE : 'pathType',
			PLACE_HOLDER : 'placeHolder',
			RANGE : 'range',
			REF_DATATYPES : 'refDataTypes',
			REF_DATABASES : 'refDatabases',
			SWEEPABLE : 'sweepable',
			SYNONYMS : 'synonyms',
			TERM_NAME : 'termName',
			TERM_TYPE : 'termType',
			TERM_VERSION : 'termVersion',
			TEXT : 'text',
			TOOLTIP : 'tooltip',
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
		}
	}

	class TermId{
		static getEmptyTermId(){
			return new TermId('', '');
		}

		constructor( name, version ){
			this.name = name ? name : '';
			this.version = version ? version : '';
		}
		
		isEmpty(){
			if( Util.isEmptyString(this.name) ){
				return true;
			}

			return false;
		}

		isNotEmpty(){
			if( !(Util.isEmptyString(this.name) || Util.isEmptyString(this.version)) ){
				return true;
			}

			return false;
		}

		sameWith( anotherId ) {
			if( anotherId.isEmpty() && this.isEmpty() ){
				return true;
			}
			else if( anotherId.isEmpty() && this.isNotEmpty() ){
				return false;
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
			
			if( valueMap ){
				$('#'+NAMESPACE+inputId).val( valueMap[selectedLocale]);
				
				AVAILABLE_LANGUAGES.forEach(function(locale, index){
					let $localizedInput = $('#'+NAMESPACE+inputId+'_'+locale);
					if( $localizedInput ){
						$localizedInput.val( valueMap[locale] );
					}
				});
			}
			else{
				$('#'+NAMESPACE+inputId).val('');
				
				AVAILABLE_LANGUAGES.forEach(function(locale, index){
					let $localizedInput = $('#'+NAMESPACE+inputId+'_'+locale);
					if( $localizedInput ){
						$localizedInput.val( '' );
					}
				});
			}
		}
		
		static clearLocaliedInputValue( inputId ){
			LocalizationUtil.setLocalizedInputValue( inputId );
		}
	}
	
	let FormUIUtil = {
		$getRequiredLabelMark: function( style ){
			let html = 
				'<span class="reference-mark text-warning" style="' + style + '">' +
					'<span>' +
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
		$getLabelNode: function( controlName, label, mandatory, helpMessage ){
			let $label = $( '<label class="control-label" for="' + controlName + '">' ); +
			$label.text( label );

			if( mandatory ){
				$label.append( this.$getRequiredLabelMark( 'margin-left:4px; margin-right:2px;' ) );
			}

			if( helpMessage ){
				$label.append( this.$getHelpMessageLabelMark(helpMessage, 'margin-left:2px;') );
			}

			return $label;
		},
		$getTextInputTag: function( term ){
			let controlName = NAMESPACE + term.termName;
			let inputType = term.multipleLine ? 'textarea' : 'text';
			let placeHolder = (typeof term.getLocalizedPlaceHolder === 'function') ? term.getLocalizedPlaceHolder() : '';
			let value = term.value ? term.value : ''

			let $input;
			
			if( inputType === 'text'){
				$input = $( '<input type="text" aria-required="true">' );
			}
			else{
				$input = $( '<textarea aria-required="true">' );
			}

			$input.prop({
				class: 'field form-control',
				id: controlName,
				name: controlName,
				value: value ? value : '',
				placeholder: placeHolder ? placeHolder : ''
			});

			$input.change(function(event){
				event.stopPropagation();
				term.value = $(this).val();

				let eventData = {
					sxeventData:{
						sourcePortlet: NAMESPACE,
						targetPortlet: NAMESPACE,
						term: term,
						valueMode: 'single',
						value: $(this).val()  
					}
				};

				Liferay.fire(
					SXIcecapEvents.DATATYPE_SDE_VALUE_CHANGED,
					eventData
				);
			});

			return $input;
		},
		$getDateInputNode: function( term ){
			let $dateTimeNode = $('<div class="lfr-ddm-field-group field-wrapper">')
						.append( this.$getLabelNode(
							NAMESPACE + term.termName, 
							term.getLocalizedDisplayName(),
							term.mandatory ? this.mandatory : false,
							term.getLocalizedTooltip() ? term.getLocalizedTooltip() : '') )
						.append( this.$getDateTimeInputNode( term ) );

			return $dateTimeNode;
		},
		$getDateTimeInputNode: function( term ){
			let controlName = NAMESPACE + term.termName;

			let $tag = $('<span class="lfr-input-date">');
			
			let $inputTag = $('<input type="text">');
			$inputTag.prop({
				'class': 'field form-control',
				'id': controlName,
				'name': controlName,
				'value': term.value,
				'aria-live': 'assertive',
				'aria-label': ''
			});

			let options = {
				lang: 'kr'
			}
			options.timepicker = ( term.enableTime === true ) ? true : false;
			$inputTag.datetimepicker(options);

			$inputTag.change(function(event){
				event.stopPropagation();
				term.value = $(this).val();

				let eventData = {
					sxeventData:{
						sourcePortlet: NAMESPACE,
						targetPortlet: NAMESPACE,
						term: term,
						value: $(this).val()  
					}
				};

				Liferay.fire(
					SXIcecapEvents.DATATYPE_SDE_VALUE_CHANGED,
					eventData
				);
			});


			$tag.append($inputTag);

			return $tag;
		},
		$getSelectTag: function( term, controlName, options, value ){
			let $select = $( '<select class="form-control" id="' + controlName + '" name="' + controlName + '">' );

			options.forEach( (option)=>{
				let $option = $( '<option>' );
				
				$option.prop('value', option.value);

				if( option.selected === true || option.value === value ){
					$option.prop( 'selected', true );
				};

				$option.text(option.labelMap[CURRENT_LANGUAGE]);

				$select.append( $option );
			});

			$select.change(function(event){
				event.stopPropagation();
				term.value = $(this).val();

				let eventData = {
					sxeventData:{
						sourcePortlet: NAMESPACE,
						targetPortlet: NAMESPACE,
						term: term,
						valueMode: 'single',
						value: $(this).val()  
					}
				};

				Liferay.fire(
					SXIcecapEvents.DATATYPE_SDE_VALUE_CHANGED,
					eventData
				);
			});

			return $select;
		},
		$getRadioButtonTag: function (controlId, controlName, label, selected, value ){
			let $label = $( '<label>' );
			let $input = $( '<input type="radio">')
									.prop({
										class: "field",
										id: controlId,
										name: controlName,
										value: value,
										checked: selected
									});
			
			$label.prop('for', controlId )
				  .append( $input )
				  .append( label );

  			let $radio = $( '<div class="radio" style="display:inline-block; margin-left:10px; margin-right:10px;">' )
							.append( $label );

			return $radio;
		},
		$getCheckboxTag: function( controlId, controlName, label, checked, value, disabled ){
			
			let $label = $( '<label>' )
							.prop( 'for', controlId );
			
			let $input = $( '<input type="checkbox" style="margin-right:10px;">');
			$input.prop({
				class: "field",
				id: controlId,
				name: controlName,
				value: value,
				checked: checked,
				disabled: disabled
			});
			
			$label.append( $input )
				  .append( label );

			let $checkbox = $( '<div class="checkbox" style="display:inline-block;margin-left:10px;margin-right:20px;">' )
								.append( $label );
			
			return $checkbox;
		},
		$getFileUploadNode: function( controlName, controlValueId, value ){
			let $node = $('<div>');
			let $inputTag = this.$getFileInputTag( controlName );
			$node.append( $inputTag );
			let $value = $('<div id="'+controlValueId+'">');
			$value.text(value);
			$node.append( $value );

			return $node;
		},
		$getFileInputTag: function( controlName ){
			let $input = $( '<input type="file" class="field lfr-input-text form-control" aria-required="true" size="80">' );

			$input.prop({
				id: controlName,
				name: controlName
			});

			return $input;
		},
		$getSelectFieldsetNode: function( term, controlName, displayStyle, label, mandatory, helpMessage, options, value){
			let $node;

			let $label = this.$getLabelNode( controlName, label, mandatory, helpMessage );
			if( displayStyle === SXConstants.DISPLAY_STYLE_SELECT ){
				
				$node = $('<div class="form-group input-text-wrapper">')
									.append( $label )
									.append( this.$getSelectTag(term, controlName, options, value) );
			}
			else{
				let $panelTitle = $('<div class="form-group input-text-wrapper control-label panel-title" id="' + controlName + 'Title">')
										.append($label);

				let $fieldsetHeader = $('<div class="panel-heading" id="' + controlName + 'Header" role="presentation">')
									.append( $panelTitle );

				let $panelBody = $('<div class="panel-body">').css('padding', '0 20px 0.75rem 10px');

				let $fieldsetContent = $('<div aria-labelledby="' + controlName + 'Header" class="in  " id="' + controlName + 'Content" role="presentation">')
										.append($panelBody);
				let $fieldSet = $('<fieldset aria-labelledby="' + controlName + 'Title" role="group">')
									.append( $fieldsetHeader )
									.append($fieldsetContent);


				let $panelGroup = $('<div aria-multiselectable="true" class="panel-group" role="tablist">')
									.append( $fieldSet );


				if( displayStyle === SXConstants.DISPLAY_STYLE_RADIO ){
					options.forEach((option, index)=>{
							let selected = (value === String(option.value));
							$panelBody.append( this.$getRadioButtonTag( 
														controlName+'_'+(index+1),
														controlName, 
														option.labelMap[CURRENT_LANGUAGE],
														selected,
														option.value,
														value ) );
					});

					$panelBody.change(function(event){
						event.stopPropagation();

						let changedVal = $(this).find('input[type="radio"]:checked').val();
						term.value = changedVal;

						let eventData = {
							sxeventData:{
								sourcePortlet: NAMESPACE,
								targetPortlet: NAMESPACE,
								term: term,
								valueMode: 'single',
								value: changedVal
							}
						};

						Liferay.fire(
							SXIcecapEvents.DATATYPE_SDE_VALUE_CHANGED,
							eventData
						);
					});
				}
				else{
					options.forEach((option, index)=>{
							$panelBody.append( this.$getCheckboxTag( 
														controlName+'_'+(index+1),
														controlName,
														option.labelMap[CURRENT_LANGUAGE],
														option.selected || value === option.value,
														option.value,
														value,
														false ) );
					});
						
					$panelBody.change(function(event){
						event.stopPropagation();

						let checkedValues = new Array();

						$.each( $(this).find('input[type="checkbox"]:checked'), function(){
							checkedValues.push( $(this).val() );
						});

						term.value = checkedValues;

						let eventData = {
							sxeventData:{
								sourcePortlet: NAMESPACE,
								targetPortlet: NAMESPACE,
								term: term,
								valueMode: 'multiple',
								value: checkedValues
							}
						};

						Liferay.fire(
							SXIcecapEvents.DATATYPE_SDE_VALUE_CHANGED,
							eventData
						);
					});
				}

				$node = $('<div class="card-horizontal main-content-card">')
								.append( $panelGroup );
			}

			return $node;
		},
		$getTextInputNode: function(term, forWhat ){
			let controlName = NAMESPACE + term.termName;
			let label = term.getLocalizedDisplayName();
			let helpMessage = term.getLocalizedTooltip() ? term.getLocalizedTooltip() : '';
			let mandatory = term.mandatory ? term.mandatory : false;

			let $node = $('<div class="form-group input-text-wrapper">')
							.append( this.$getLabelNode(controlName, label, mandatory, helpMessage) );
			
			if( forWhat === SXConstants.FOR_SEARCH ){
				$node.append(this.$getTextInputTag(term));
				// $node.append(this.$getTextSearchInputTag(term));
			}
			else{
				$node.append(this.$getTextInputTag(term));
			}

			
			return $node;
		},
		$getTextSearchNode: function( term, query ){
			let controlName = NAMESPACE + term.termName + '_search';

			let $input = $( '<input type="text" aria-required="true">' );

			$input.prop({
				class: 'field form-control',
				id: controlName,
				name: controlName,
				value: query ? query : '',
				placeholder: query ? query : 'Enter keywords for search'
			});

			$input.change(function(event){
				event.stopPropagation();
				term.value = $(this).val();

				let eventData = {
					sxeventData:{
						sourcePortlet: NAMESPACE,
						targetPortlet: NAMESPACE,
						term: term,
						valueMode: 'single',
						value: $(this).val()  
					}
				};

				Liferay.fire(
					SXIcecapEvents.SD_SEARCH_KEYWORD_CHANGED,
					eventData
				);
			});

			return $input;
		},
		$getPreviewRemoveButtonNode: function( term, iconClass ){
			let $button = $( '<button type="button" class="btn btn-default">' +
								'<i class="' + iconClass + '" />' +
							 '</button>' );
							 
			$button.click(function(event){
				event.stopPropagation();
				/*
				let msg = Liferay.Language.get('are-you-sure-to-delete-the-term-from-the-data-structure');
				if( term.isMemberOfGroup() ){
					if( term.isGroupTerm() ){
						msg = 'this-group-type-term-is-a-member-of-a-group-if-you-push-delete-button-all-sub-terms-will-be-deleted-from-the-structure-otherwise-to-remove-from-the-group'
					}
					else{
						msg = Liferay.Language.get('the-term-is-a-member-of-a-group-please-push-delete-button-to-delete-from-the-structure-or-push-remove-button-to-remove-from-the-group');
					}
				}
				else{
					if( term.isGroupTerm() ){
						msg = 'this-group-type-term-is-a-member-of-a-group-if-you-push-delete-button-all-sub-terms-will-be-deleted-from-the-structure-otherwise-to-remove-from-the-group'
					}
					else{
						msg = Liferay.Language.get('the-term-is-a-member-of-a-group-please-push-delete-button-to-delete-from-the-structure-or-push-remove-button-to-remove-from-the-group');
					}
				}
				*/

				let eventData = {
					sxeventData:{
						sourcePortlet: NAMESPACE,
						targetPortlet: NAMESPACE,
						term: term
					}
				};

				Liferay.fire(
					SXIcecapEvents.DATATYPE_PREVIEW_REMOVE_TERM,
					eventData
				);
				
				/*
				let dialogProperty = {
					autoOpen: true,
					title:'',
					modal: true,
					draggable: true,
					width: 400,
					highr: 200,
					buttons:[
						{
							text: 'Delete',
							click: function(){
								Liferay.fire(
									SXIcecapEvents.DATATYPE_PREVIEW_DELETE_TERM,
									eventData
								);
								$(this).dialog('destroy');
							}
						},
						{
							text: 'Cancel',
							click:function(){
								$(this).dialog('destroy');
							}
						}
					]
				};

				if( term.isMemberOfGroup() ){
					dialogProperty.buttons.unshift({
						text: 'Remove',
						click: function(){
							$(this).dialog('destroy');
							Liferay.fire(
								SXIcecapEvents.DATATYPE_PREVIEW_REMOVE_TERM,
								eventData
							);
						}
					});
				}

				$('<div>').text(msg).dialog( dialogProperty );
				*/
				
			});

			return $button;
		},
		$getPreviewRowSection: function( term, $inputSection ){
			let trRowClass = NAMESPACE + term.termName;

			let $inputTd = $('<td style="width:90%;">').append( $inputSection );

			let $buttonTd = $('<td style="padding-right:0;">')
								.append( this.$getPreviewRemoveButtonNode( term, 'icon-remove' ) );

			let $previewRow = $('<tr>')
									.addClass( trRowClass )
									.append( $inputTd )
									.append( $buttonTd );
			
			$previewRow.click( function( event ){
				event.stopPropagation();
				
				const eventData = {
					sxeventData:{
						sourcePortlet: NAMESPACE,
						targetPortlet: NAMESPACE,
						term: term
					}
				};
				
				Liferay.fire( SXIcecapEvents.DATATYPE_PREVIEW_TERM_SELECTED, eventData );
			});

			return $previewRow;
		},
		$getEditorRowSection: function( term, $inputSection ){
			let $inputTd = $('<td style="width:100%; border:none;">').append( $inputSection );

			let $row = $('<tr>').append( $inputTd );

			return $row;
		},
		$getSearchRowSection: function( term, $inputSection ){
			return $inputSection;
		},
		$getFormStringSection: function( 
					term, 
					forWhat ){

			let inputType = term.multipleLine ? 'textarea' : 'text';
			let label = term.getLocalizedDisplayName();
			let placeHolder = term.getLocalizedPlaceHolder() ? term.getLocalizedPlaceHolder() : '';
			let helpMessage = term.getLocalizedTooltip() ? term.getLocalizedTooltip() : '';
			let mandatory = term.mandatory ? term.mandatory : false;
			let value = term.value ? term.value : '';

			let $textInput = this.$getTextInputNode( term, forWhat );

			let $String;
			if( forWhat === SXConstants.FOR_PREVIEW ){
				$String = this.$getPreviewRowSection( term, $textInput );
			}
			else if(forWhat === SXConstants.FOR_EDITOR ){
				$String = this.$getEditorRowSection( term, $textInput );
			}
			else if( forWhat === SXConstants.FOR_SEARCH ){
				$String = this.$getSearchRowSection( term, $textInput );
			}
			else{
				//PDF printing here
			}

			return $String;
		},
		$getFormDateSection: function(
					term,
					forWhat	){
			let $dateInput = this.$getDateInputNode( term );

			let $section;
			if( forWhat === SXConstants.FOR_PREVIEW ){
				$section = this.$getPreviewRowSection( term, $dateInput );
			}
			else if(forWhat === SXConstants.FOR_EDITOR){
				$section = this.$getEditorRowSection( term, $dateInput );
			}
			else{
				//PDF printing here
			}

			return $section;
		},
		$getFormNumericSection: function(
			term, 
			label, 
			helpMessage, 
			mandatory, 
			value,
			minValue,
			minBoundary,
			maxValue,
			maxBoundary,
			unit,
			uncertainty,
			uncertaintyValue,
			forWhat ){

			let controlName = NAMESPACE + term.termName;

			let $viewCol = $('<div>');
			
			let $label = this.$getLabelNode( controlName, label, mandatory, helpMessage );
			$viewCol.append( $label );
			
			let $controlSection = $('<div style="display:flex; align-items:center;justify-content: center; width:100%; margin:0; padding:0;">');
			$viewCol.append( $controlSection );

			let valueRate = 100;
			if( minValue ){
				let $minValueCol = $('<div style="display:inline-block;min-width:3%;text-align:center;"><strong>' +
				minValue +
				'</strong></div>');
				$controlSection.append( $minValueCol );
				valueRate = 95;
				
				let minBoundaryText = '&lt;';
				if( minBoundary ){
					minBoundaryText = '&le;';
				}

				let $minBoundaryCol = '<div style="display:inline-block;min-width:3%;text-align:center;margin-right:5px;"><strong>' +
				minBoundaryText +
				'</strong></div>';
				$controlSection.append( $minBoundaryCol );

				valueRate = 90;
			}
			
			let $textInput = this.$getTextInputTag( term, controlName, term.placeHolder.getText(DEFAULT_LANGUAGE), value );
			let $inputcol = $('<div style="display:inline-block; width:100%;">').append($textInput);
			$controlSection.append( $inputcol );
			
			if( uncertainty ){
				let $uncertaintyOp = $('<div style="display:inline-block;min-width:3%;text-align:center;margin:0 5px 0 5px;"><strong>&#xB1;</strong></div>');
				$controlSection.append( $uncertaintyOp );

				let $uncertaintyInput = this.$getTextInputTag( 'text', term, controlName+'_uncertainty', '', uncertaintyValue );
				let $inputcol = $('<div style="display:inline-block; max-width:40%;">').append($uncertaintyInput);
				$controlSection.append( $inputcol );
			}

			if( unit ){
				let $unit = $('<div style="display:inline-block;min-width:3%;text-align:center;margin:1rem 10px 0 10px;">' +
								unit +
							'</div>');
				$controlSection.append( $unit );
			}

			if( maxValue ){
				
				let maxBoundaryText = '&lt;';
				if( maxBoundary ){
					maxBoundaryText = '&le;';
				}
				
				let $maxBoundaryCol = '<div style="display:inline-block;min-width:3%;text-align:center;margin:0 2px 0 2px;"><strong>' +
				maxBoundaryText +
				'</strong></div>';

				let $maxValueCol = $('<div style="display:inline-block;min-width:3%;text-align:center;"><strong>' +
				maxValue +
				'</strong></div>');
				
				$controlSection.append( $maxBoundaryCol );
				$controlSection.append( $maxValueCol );
			}
			
			let trRowClass = NAMESPACE + term.termName;
			let $Numeric = null;
			
			if( forWhat === SXConstants.FOR_PREVIEW ){
				$Numeric = FormUIUtil.$getPreviewRowSection(term, $viewCol);
			}
			else if( forWhat === SXConstants.FOR_EDITOR ){
				$Numeric = FormUIUtil.$getEditorRowSection(term, $viewCol);
			}
			else{
				// render for PDF printing here
			}
			
			return $Numeric;

		},
		$getFormListSection: function(
				term,
				label, 
				helpMessage, 
				mandatory, 
				value,
				displayStyle,
				options,
				dependentTerms,
				forWhat ){
			let controlName = NAMESPACE + term.termName;

			let $fieldset = this.$getSelectFieldsetNode( term, controlName, displayStyle, label, mandatory, helpMessage, options, value );
			
			let $List;
			if( forWhat === SXConstants.FOR_PREVIEW ){
				$List = this.$getPreviewRowSection(term, $fieldset);
			}
			else if( forWhat === SXConstants.FOR_EDITOR ){
				$List = this.$getEditorRowSection(term, $fieldset);
			}
			else{
				// rendering for PDF here
			}

			return $List;
		},
		$getFormFileUploadSection: function(
			term,
			label,
			helpMessage,
			mandatory,
			value,
			forWhat ){
			let controlName = NAMESPACE + term.termName;
			let controlValueId = NAMESPACE + term.termName + '_value';

			let $uploadSection = $('<div class="form-group input-text-wrapper">');
			
			let $label = this.$getLabelNode( controlName, label, mandatory, helpMessage );
			$uploadSection.append( $label );

			let $uploadNode = this.$getFileUploadNode(controlName, controlValueId, value);
			
			$uploadNode.change(function(event){
				event.stopPropagation();

				let fileName = $('#'+controlName)[0].files.length ? $('#'+controlName)[0].files[0].name : "";
				term.value = fileName;

				let eventData = {
					sxeventData:{
						sourcePortlet: NAMESPACE,
						targetPortlet: NAMESPACE,
						term: term,
						valueMode: 'single',
						value: $(this).val()  
					}
				};

				Liferay.fire(
					SXIcecapEvents.DATATYPE_SDE_VALUE_CHANGED,
					eventData
				);
			});

			$uploadSection.append( $uploadNode );

			let $row;
			if( forWhat === SXConstants.FOR_PREVIEW ){
				$row = this.$getPreviewRowSection(term, $uploadSection);
			}
			else if( forWhat === SXConstants.FOR_EDITOR ){
				$row = this.$getEditorRowSection(term, $uploadSection);
			}
			else{
				// rendering for PDF here
			}

			return $row;
		},
		$getAccordionForGroup: function( title, $body ){
			let $groupHead = $('<h3>').text(title);
			let $groupBody = $('<div style="width:100%; height:auto;">')
								.append($body);
			let $accordion = $('<div style="width:100%;">')
								.append($groupHead)
								.append($groupBody);
			
			$accordion.accordion({
				collapsible: true,
				active: true,
				highStyle: 'content',
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
			$('#'+NAMESPACE+'typeSpecificSection .type-specific-attrs.show').removeClass('show').addClass('hide');

			FormUIUtil.$getTypeSpecificSection( termType ).removeClass('hide').addClass('show');
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
			
			if( value ){
				$control.val( value );
			}
			else{
				$control.val( '' );
			}
			
			if( focus ){
				$control.focus();
			}

		},
		clearFormValue: function( attrName ){
			FormUIUtil.setFormValue( attrName );
		},
		getFormLocalizedValue: function( attrName ){
			return LocalizationUtil.getLocalizedInputValue( attrName );
		},
		setFormLocalizedValue: function( attrName, localizedMap, focus ){
			let $control = $('#'+NAMESPACE+attrName);
			
			if( localizedMap ){
				LocalizationUtil.setLocalizedInputValue( attrName, localizedMap );
			}
			else{
				LocalizationUtil.setLocalizedInputValue( attrName );
			}
			
			if( focus ){
				$control.focus();
			}
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
		}
	};
	
	const SXIcecapEvents = {
		DATATYPE_PREVIEW_TERM_DELETED: 'DATATYPE_PREVIEW_TERM_DELETED',
		DATATYPE_PREVIEW_REMOVE_TERM: 'DATATYPE_PREVIEW_REMOVE_TERM',
		DATATYPE_PREVIEW_DELETE_TERM: 'DATATYPE_PREVIEW_DELTE_TERM',
		DATATYPE_PREVIEW_TERM_SELECTED: 'DATATYPE_PREVIEW_TERM_SELECTED',
		DATATYPE_FORM_UI_SHOW_TERMS: 'DATATYPE_FORM_UI_SHOW_TERMS',
		DATATYPE_ACTIVE_TERM_CHANGED: 'DATATYPE_ACTIVE_TERM_CHANGED',
		DATATYPE_FORM_UI_CHECKBOX_CHANGED: 'DATATYPE_FORM_UI_CHECKBOX_CHANGED',
		LIST_OPTION_ACTIVE_TERM_DELETED: 'LIST_OPTION_ACTIVE_TERM_REMOVED',
		LIST_OPTION_ACTIVE_TERM_SELECTED: 'LIST_OPTION_ACTIVE_TERM_SELECTED',
		LIST_OPTION_PREVIEW_REMOVED: 'LIST_OPTION_PREVIEW_REMOVED',
		LIST_OPTION_PREVIEW_SELECTED: 'LIST_OPTION_PREVIEW_SELECTED',
		LIST_OPTION_ACTIVE_TERMS_CHANGED:'LIST_OPTION_ACTIVE_TERMS_CHANGED',

		TERM_PROPERTY_CHANGED: 'TERM_PROPERTY_CHANGED',
		DATATYPE_SDE_VALUE_CHANGED: 'DATATYPE_SDE_VALUE_CHANGED',

		SD_SEARCH_KEYWORD_CHANGED: 'SD_SEARCH_KEYWORD_CHANGED'
	};

	const SXConstants = {
		FOR_NOTHING: 0,
		FOR_PREVIEW: 1,
		FOR_EDITOR: 2,
		FOR_PRINT:3,
		FOR_SEARCH:4,

		DISPLAY_STYLE_SELECT: 'select',
		DISPLAY_STYLE_RADIO: 'radio',
		DISPLAY_STYLE_CHECK: 'check',

		STOP_EVERY: false,
		CONTINUE_EVERY: true,

		FILTER_SKIP: false,
		FILTER_ADD: true,

		FAIL: false,
		SUCCESS: true,

		SINGLE: false,
		ARRAY: true
	};
	
	class LocalizedObject {
		constructor( localizedMap  ){
			if( localizedMap ){
				this.localizedMap = localizedMap;
			}
			else{
				this.localizedMap = {};
			}
		}
		
		isEmpty(){
			return Object.keys( this.localizedMap ).length ? false : true;
		}
		
		getLocalizedMap(){
			return this.localizedMap;
		}
		
		setLocalizedMap( map ){
			if( Object.keys( map ).length <= 0 ){
				if( this.localizedMap ){
					delete this.localizedMap;
				}
			}
			else{
				this.localizedMap = map;
			}
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
		constructor( optionLabelMap, optionValue, selected, activeTerms ){
			this.value = optionValue;
			this.labelMap = optionLabelMap;
			this.activeTerms = activeTerms;
			this.selected = selected;
			this.$rendered = null;
		}

		getLabelMap(){
			return this.labelMap;
		}

		setLabelMap( map ){
			this.labelMap = map;
		}

		addActiveTerm( term ){
			this.activeTerms.push( term );
		}

		removeActiveTerm( term ){
			this.activeTerms = this.activeTerms.filter(( activeTerm ) => {
				return !(activeTerm.termName === term.termName);
			});
		}

		$renderPreview(rerender=true){
			if( rerender === false && this.$rendered ){
				return this.$rendered;
			}
			else{
				let html = '<tr>' +
				'<td class="option-label" style="width:50%;">' + this.labelMap[CURRENT_LANGUAGE] + '</td>' +
				'<td class="option-value" style="width:30%;">' + this.value + '</td>' +
				'<td class="option-selected" style="width:10%;">';
				if( this.selected ){
					html += '&#10004;';
				}
				html += '</td>';
				html += '<td>' +
				'<button type="button" class="btn btn-default">' +
				'<i class="icon-remove" />' +
				'</button>' +
				'</td> </tr>';
				
				let $row = $( html );
				
				let self = this;
				$row.find('button').click(function(event){
					event.stopPropagation();
					
					let eventData = {
						sxeventData:{
							sourcePortlet: NAMESPACE,
							targetPortlet: NAMESPACE,
							option: self
						}
					};
					
					Liferay.fire( SXIcecapEvents.LIST_OPTION_PREVIEW_REMOVED, eventData );
				});
				
				$row.click(function(event){
					event.stopPropagation();
					
					let eventData = {
						sxeventData:{
							sourcePortlet: NAMESPACE,
							targetPortlet: NAMESPACE,
							option: self
						}
					};
					
					Liferay.fire( SXIcecapEvents.LIST_OPTION_PREVIEW_SELECTED, eventData );
				});

				return $row;
			}
		}

		renderActiveTermsPreview( $previewPanel ){
			$previewPanel.empty();

			this.activeTerms.every( (activeTerm, index, ary) =>{
				let $row = $( '<tr>' +
						'<td style="width:35%;">' +
							activeTerm.termName +
						'</td>' +
						'<td style="width:20%;">' +
							activeTerm.termType +
						'</td>' +
						'<td style="width:35%;">' +
							activeTerm.displayName.getText(CURRENT_LANGUAGE) +
						'</td>' +
						'<td>' +
							'<button type="button" class="btn btn-default">' +
								'<i class="icon-remove" />' +
							'</button>' +
						'</td>' +
					'</tr>' );

				let self = this;
				$row.find('button').click(function(event){
					event.stopPropagation();

					self.removeActiveTerm( activeTerm );

					$row.remove();

					let eventData = {
						sxeventData:{
							sourcePortlet: NAMESPACE,
							targetPortlet: NAMESPACE,
							term: activeTerm
						}
					}

					Liferay.fire( SXIcecapEvents.LIST_OPTION_ACTIVE_TERM_REMOVED, eventData );
				});

				$row.click(function(event){
					event.stopPropagation(); 
					
					$previewPanel.find('.highlight-border').removeClass('highlight-border');
					$row.addClass('highlight-border');
					
					let eventData = {
						sxeventData:{
							sourcePortlet: NAMESPACE,
							targetPortlet: NAMESPACE,
							term: activeTerm
						}
					}

					Liferay.fire( SXIcecapEvents.LIST_OPTION_ACTIVE_TERM_SELECTED, eventData );
				});
				
				$previewPanel.append( $row );
			});
		}

		toJSON(){
			let json = new Object();

			json.value = this.value;
			json.labelMap = this.labelMap;
			if( this.selected ){
				json.selected = true;
			}
			if( !Util.isEmptyArray( this.activeTerms ) ){
				json.activeTerms = this.activeTerms;
			}

			return json;
		}
	}

	class TermPropertyControl{
		static $DEFAULT_TERM_TYPE_FORM_CTRL = $('#' + NAMESPACE + 'termType');
		static $DEFAULT_TERM_NAME_FORM_CTRL = $('#' + NAMESPACE + 'termName');
		static $DEFAULT_TERM_VERSION_FORM_CTRL = $('#' + NAMESPACE + 'termVersion');
		static $DEFAULT_TERM_DISPLAY_NAME_FORM_CTRL = $('#' + NAMESPACE + 'termDisplayName');
		static $DEFAULT_TERM_DEFINITION_FORM_CTRL = $('#' + NAMESPACE + 'termDefinition');
		static $DEFAULT_TERM_TOOLTIP_FORM_CTRL = $('#' + NAMESPACE + 'termTooltip');
		static $DEFAULT_TERM_SYNONYMS_FORM_CTRL = $('#' + NAMESPACE + 'synonyms');
		static $DEFAULT_TERM_MANDATORY_FORM_CTRL = $('#' + NAMESPACE + 'mandatory');
		static $DEFAULT_TERM_VALUE_FORM_CTRL = $('#' + NAMESPACE + 'value');
		static $DEFAULT_ABSTRACT_KEY_FORM_CTRL = $('#' + NAMESPACE + 'abstractKey');

		constructor( termName, termVersion, propertyName, propertyType, $control){
			this.termName = termName;
			this.termVersion = termVersion;
			this.propertyName = propertyName;
			this.propertyType = propertyType;
			this.$control = $control;
		}
	}

	class TextTermPropertyControl extends TermPropertyControl {
		static PROPERTY_TYPE = 'text';

		constructor(termName, termVersion, propertyName, $control){
			super(termName, termVersion, propertyName, TextTermPropertyControl.PROPERTY_TYPE, $control);

			$control.change( function(event){
				Liferay.fire(
					SXIcecapEvents.TERM_PROPERTY_CHANGED,
					{
						termName: termName,
						termVersion: termVersion,
						propertyName: propertyName,
						propertyType: TextTermPropertyControl.PROPERTY_TYPE,
						value: this.getPropertyValue()
					}
				);
			});
		}

		getPropertyValue(){
			return this.$control.val();
		}

		setPropertyValue( value ){
			this.$control.val( value );
		}
	}

	class SelectTermPropertyControl extends TermPropertyControl {
		static PROPERTY_TYPE = 'select';

		constructor(termName, termVersion, propertyName, $control){
			super(termName, termVersion, propertyName, SelectTermPropertyControl.PROPERTY_TYPE, $control);

			$control.change( function(event){
				Liferay.fire(
					SXIcecapEvents.TERM_PROPERTY_CHANGED,
					{
						termName: termName,
						termVersion: termVersion,
						propertyName: propertyName,
						propertyType: SelectTermPropertyControl.PROPERTY_TYPE,
						value: this.getPropertyValue()
					}
				);
			});
		}

		getPropertyValue(){
			return this.$control.val();
		}

		setPropertyValue( value ){
			this.$control.val( value );
		}
	}

	class RadioTermPropertyControl extends TermPropertyControl {
		static PROPERTY_TYPE = 'radio';

		constructor(termName, termVersion, propertyName, $control){
			super(termName, termVersion, propertyName, RadioTermPropertyControl.PROPERTY_TYPE, $control);

			$control.change( function(event){
				Liferay.fire(
					SXIcecapEvents.TERM_PROPERTY_CHANGED,
					{
						termName: termName,
						termVersion: termVersion,
						propertyName: propertyName,
						propertyType: RadioTermPropertyControl.PROPERTY_TYPE,
						value: this.getPropertyValue()
					}
				);
			});
		}

		getPropertyValue(){
			return this.$control.find('input[type="radio"]:checked').val();
		}

		setPropertyValue( value ){
			this.$control.filter('[value='+value+']').prop('checked', true);
		}
	}

	class CheckboxTermPropertyControl extends TermPropertyControl {
		static PROPERTY_TYPE = 'checkbox';

		constructor(termName, termVersion, propertyName, $control){
			super(termName, termVersion, propertyName, CheckboxTermPropertyControl.PROPERTY_TYPE, $control);

			$control.change( function(event){
				Liferay.fire(
					SXIcecapEvents.TERM_PROPERTY_CHANGED,
					{
						termName: termName,
						termVersion: termVersion,
						propertyName: propertyName,
						propertyType: CheckboxTermPropertyControl.PROPERTY_TYPE,
						value: this.getPropertyValue()
					}
				);
			});
		}

		getPropertyValues(){
			return this.$control.filter('input[type="checkbox"]:checked')
								.map(function(){return this.value;})
								.get();
		}

		setPropertyValues( values ){
			for( i=0; i<values.length; i++){
				this.$control.filter('[value='+values[i]+']').prop('checked', true);
			}
		}

		setChecked( value, check ){
			this.$control.find('input[type="checkbox" value='+value+']').prop('checked', check);
		}
	}

	class Term {
		static DEFAULT_TERM_ID = 0;
		static DEFAULT_TERM_VERSION = '1.0.0';
		static DEFAULT_MANDATORY = false;
		static DEFAULT_ABSTRACT_KEY = false;
		static DEFAULT_SEARCHABLE = false;
		static DEFAULT_DOWNLOADABLE = true;
		static DEFAULT_MIN_LENGTH = 1;
		static DEFAULT_VALUE_MODE = SXConstants.SINGLE;

		static VALID_NAME_PATTERN=/^[_a-zA-Z]([_a-zA-Z0-9])*$/;

		static STATE_INIT = -1;
		static STATE_PREVIEWED = 0;
		static STATE_DIRTY = 2;
		static STATE_ACTIVE = 3;
		static STATE_INACTIVE = 4;

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

		static $DEFAULT_TERM_TYPE_FORM_CTRL = $('#' + NAMESPACE + 'termType');
		static $DEFAULT_TERM_NAME_FORM_CTRL = $('#' + NAMESPACE + 'termName');
		static $DEFAULT_TERM_VERSION_FORM_CTRL = $('#' + NAMESPACE + 'termVersion');
		static $DEFAULT_TERM_DISPLAY_NAME_FORM_CTRL = $('#' + NAMESPACE + 'termDisplayName');
		static $DEFAULT_TERM_DEFINITION_FORM_CTRL = $('#' + NAMESPACE + 'termDefinition');
		static $DEFAULT_TERM_TOOLTIP_FORM_CTRL = $('#' + NAMESPACE + 'termTooltip');
		static $DEFAULT_TERM_SYNONYMS_FORM_CTRL = $('#' + NAMESPACE + 'synonyms');
		static $DEFAULT_TERM_MANDATORY_FORM_CTRL = $('#' + NAMESPACE + 'mandatory');
		static $DEFAULT_TERM_VALUE_FORM_CTRL = $('#' + NAMESPACE + 'value');
		static $DEFAULT_ABSTRACT_KEY_FORM_CTRL = $('#' + NAMESPACE + 'abstractKey');
		static $DEFAULT_SEARCHABLE_FORM_CTRL = $('#' + NAMESPACE + 'searchable');
		static $DEFAULT_DOWNLOADABLE_FORM_CTRL = $('#' + NAMESPACE + 'downloadable');

		constructor( termType ){
			
			this.termId = 0;
			this.termType = termType;

			this.$rendered = null;
			this.dirty = false;
		}

		static validateTermVersion( updated, previous ){
			let updatedParts = updated.split('.');
			
			let validationPassed = true;
			
			// Check valid format
			if( updatedParts.length !== 3 )		return false;
			
			updatedParts.every((part)=>{
				
				let int = Number(part); 
				
				if( Number.isInteger(int) ){
					return SXConstants.CONTINUE_EVERY;
				}
				else{
					validationPassed = SXConstants.FAIL;
					return SXConstants.STOP_EVERY;
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

		getTermId(){
			if( !(Util.isEmptyString( this.termName ) || Util.isEmptyString( this.termVersion )) ){
				return new TermId(this.termName,this.termVersion);
			}
			else{
				return TermId.getEmptyTermId();
			}
		}

		getGroupId(){
			if( this.isMemberOfGroup() ){
				return this.groupTermId ;
			}
			else{
				return TermId.getEmptyTermId();
			}
		}

		isRendered(){
			return !this.$rendered ? false : true;
		}

		isOrdered(){
			return (this.order && this.order > 0) ? true : false;
		}

		setDirty( dirty ){
			if( dirty ){
				this.dirty = dirty;
			}
			else{
				delete this.dirty;
			}
		}

		clearDirty(){
			this.setDirty();
		}

		getPrimaryKey( termName='', termVersion='' ){
			if( !(Util.isEmptyString(termName) || Util.isEmptyString(termVersion)) ){
				return {
					name: this.termName,
					version: this.termVersion
				};
			}
			else{
				return {
					name: termName,
					version: termVersion
				};
			}
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

		emptyRender(){
			if( this.$rendered ){
				this.$rendered.remove();
				this.$rendered = null;
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
				return false;
			}
			else{
				const tooltip = this.tooltip.getText(CURRENT_LANGUAGE);
				return tooltip ? tooltip : this.tooltip.getText(DEFAULT_LANGUAGE);
			}
		}

		addSynonym( synonym ){
			if( !this.synonyms )
				this.sysnonyms = new Array();
			this.synonyms.push( synonym );
		}
		
		removeSynonym( synonym ){
			if( !this.synonyms )		return;
			
			this.synonyms.every( (item, index, arr ) => {
				if( item === synonym ){
					this.synonyms.splice( index, 1 );
					return SXConstants.STOP_EVERY;
				}
				
				return SXConstants.CONTINUE_EVERY;
			});
		}
		
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

		
		toJSON(){
			let json = {};
			
			json.termType = this.termType;
			if( this.termName )		json.termName = this.termName;	
			if( this.termVersion && this.termVersion !== Term.DEFAULT_TERM_VERSION )	json.termVersion = this.termVersion;
			if( this.displayName && !this.displayName.isEmpty() ) json.displayName = this.displayName.getLocalizedMap();
			if( this.definition && !this.definition.isEmpty() ) json.definition = this.definition.getLocalizedMap();
			if( this.abstractKey )	json.abstractKey = this.abstractKey;
			if( this.searchable )	json.searchable = this.searchable;
			if( this.downloadable === false )	json.downloadable = this.downloadable;
			if( this.tooltip && !this.tooltip.isEmpty() ) json.tooltip = this.tooltip.getLocalizedMap();
			if( this.synonyms && this.synonyms.length > 0 ) json.synonyms = this.synonyms;
			if( this.mandatory )	json.mandatory = this.mandatory;
			if( this.value || (typeof this.value) === 'number' )	json.value = this.value;
			if( this.order )	json.order = this.order;
			if( this.dirty )	json.dirty = this.dirty;
			if( this.isMemberOfGroup() )	json.groupTermId = this.groupTermId.toJSON();
			
			json.status = this.status;
			json.state = this.state;
			
			return json;
		}
		
		parse( json ){
			let unparsed = {};
			
			let self = this;
			Object.keys( json ).forEach(function(key, index){
				switch( key ){
					case 'dirty':
						self[key] = false;
						break;
					case 'termType':
					case 'termId':
					case 'termName':
					case 'termVersion':
					case 'synonyms':
					case 'abstractKey':
					case 'searchable':
					case 'downloadable':
					case 'mandatory':
					case 'value':
					case 'active':
					case 'order':
					case 'state':
					case 'status':
						self[key] = json[key];
						break;
					case 'groupTermId':
						if( typeof json.groupTermId === 'string' ){
							json.groupTermId = JSON.parse( json.groupTermId );	
						}

						self[key] = new TermId(json[key].name, json[key].version);
						break;
					case 'displayName':
					case 'definition':
					case 'tooltip':
						self[key] = new LocalizedObject(); 
						self[key].setLocalizedMap( json[key] );
						break;
					default:
						unparsed[key] = json[key];
				}
			});

			this.initAllAttributes();
			
			return unparsed;
		}
		
		/****************************************************************
		 * Setter and getter UIs for form control values of the definer's edit section.
		 * Form controls should be consist of [namespace]+[term attribute name]
		 ****************************************************************/
		getTermTypeFormValue ( save=true ){
			let value = FormUIUtil.getFormValue( TermAttributes.TERM_TYPE );
			if( save ){
				this.termType = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setTermTypeFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( TermAttributes.TERM_TYPE, value );
			}
			else if( this.termType ){
				FormUIUtil.setFormValue( TermAttributes.TERM_TYPE, this.termType );
			}
			else{
				FormUIUtil.setFormValue( TermAttributes.TERM_TYPE, TermTypes.STRING );
			}
		}
		
		getTermNameFormValue ( save=true ){
			let value = FormUIUtil.getFormValue( TermAttributes.TERM_NAME );
			if( save ){
				this.termName = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setTermNameFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( TermAttributes.TERM_NAME, value );
			}
			else if( this.termName ){
				FormUIUtil.setFormValue( TermAttributes.TERM_NAME, this.termName );
			}
			else{
				FormUIUtil.setFormValue( TermAttributes.TERM_NAME, '' );
			}
		}
		
		getTermVersionFormValue ( save=true ){
			let value = FormUIUtil.getFormValue( TermAttributes.TERM_VERSION );
			if( save ){
				this.termVersion = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setTermVersionFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( TermAttributes.TERM_VERSION, value );
			}
			else if( this.termVersion ){
				FormUIUtil.setFormValue( TermAttributes.TERM_VERSION, this.termVersion );
			}
			else{
				FormUIUtil.setFormValue( TermAttributes.TERM_VERSION, Term.DEFAULT_TERM_VERSION );
			}

			if( this.isRendered() ){

			}
		}
		
		getDisplayNameFormValue ( save=true ){
			let valueMap = FormUIUtil.getFormLocalizedValue( 'termDisplayName' );
			if( save ){
				this.displayName = new LocalizedObject();
				this.displayName.setLocalizedMap( valueMap );
				this.setDirty( true );
			}
			
			return valueMap;
		}
		setDisplayNameFormValue ( valueMap ){
			if( valueMap ){ 
				FormUIUtil.setFormLocalizedValue( 'termDisplayName', valueMap );
			}
			else if( this.displayName ){
				FormUIUtil.setFormLocalizedValue( 'termDisplayName', this.displayName.getLocalizedMap() );
			}
			else{
				FormUIUtil.setFormLocalizedValue( 'termDisplayName' );
			}
		}
		
		getDefinitionFormValue ( save=true ){
			let valueMap = FormUIUtil.getFormLocalizedValue( 'termDefinition' );
			if( save ){
				this.definition = new LocalizedObject();
				this.definition.setLocalizedMap( valueMap );
				this.setDirty( true );
			}
			
			return valueMap;
		}
		setDefinitionFormValue ( valueMap ){
			if( valueMap ){
				FormUIUtil.setFormLocalizedValue( 'termDefinition', valueMap );
			}
			else if( this.definition ){
				FormUIUtil.setFormLocalizedValue( 'termDefinition', this.definition.getLocalizedMap() );
			}
			else{
				FormUIUtil.setFormLocalizedValue( 'termDefinition' );
			}
		}

		getAbstractKeyFormValue( save=true ){
			let value = FormUIUtil.getFormCheckboxValue( TermAttributes.ABSTRACT_KEY );
			
			if( save ){
				this.abstractKey = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setAbstractKeyFormValue ( value ){
			if( value ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.ABSTRACT_KEY, value );
			}
			else if( this.abstractKey ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.ABSTRACT_KEY, this.abstractKey );
			}
			else{
				FormUIUtil.setFormCheckboxValue( TermAttributes.ABSTRACT_KEY, Term.DEFAULT_ABSTRACT_KEY );
			}
		}

		getSearchableFormValue( save=true ){
			let value = FormUIUtil.getFormCheckboxValue( TermAttributes.SEARCHABLE );
			
			if( save ){
				this.searchable = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setSearchableFormValue ( value ){
			if( value ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.SEARCHABLE, value );
			}
			else if( this.searchable ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.SEARCHABLE, this.searchable );
			}
			else{
				FormUIUtil.setFormCheckboxValue( TermAttributes.SEARCHABLE, Term.DEFAULT_SEARCHABLE );
			}
		}

		getDownloadableFormValue( save=true ){
			let value = FormUIUtil.getFormCheckboxValue( TermAttributes.DOWNLOADABLE );
			
			if( save ){
				this.downloadable = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setDownloadableFormValue ( value ){
			if( value ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.DOWNLOADABLE, value );
			}
			else if( this.downloadable === false ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.DOWNLOADABLE, this.downloadable );
			}
			else{
				FormUIUtil.setFormCheckboxValue( TermAttributes.DOWNLOADABLE, Term.DEFAULT_DOWNLOADABLE );
			}
		}

		getTooltipFormValue ( save=true ){
			let valueMap = FormUIUtil.getFormLocalizedValue( 'termTooltip' );

			if( save ){
				if( Object.keys( valueMap ).length <= 0 && this.tooltip ){
					this.tooltip = null;
				}
				else{
					this.tooltip = new LocalizedObject();
					this.tooltip.setLocalizedMap( valueMap );
				}
				this.setDirty( true );
			}
			
			return valueMap;
		}
		setTooltipFormValue ( valueMap ){
			if( valueMap ){
				FormUIUtil.setFormLocalizedValue( 'termTooltip', valueMap );
			}
			else if( this.tooltip ){
				FormUIUtil.setFormLocalizedValue( 'termTooltip', this.tooltip.getLocalizedMap() );
			}
			else{
				FormUIUtil.setFormLocalizedValue( 'termTooltip' );
			}
		}
		
		getSynonymsFormValue ( save=true ){
			let value = FormUIUtil.getFormValue( TermAttributes.SYNONYMS );
			if( save ){
				this.synonyms = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setSynonymsFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( TermAttributes.SYNONYMS, value );
			}
			else if( this.synonyms ){
				FormUIUtil.setFormValue( TermAttributes.SYNONYMS, this.synonyms );
			}
			else{
				FormUIUtil.clearFormValue( TermAttributes.SYNONYMS );
			}
		}

		getMandatoryFormValue ( save=true ){
			let value = FormUIUtil.getFormCheckboxValue( TermAttributes.MANDATORY );
			
			if( save ){
				this.mandatory = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setMandatoryFormValue ( value ){
			if( value ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.MANDATORY, value );
			}
			else if( this.mandatory ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.MANDATORY, this.mandatory );
			}
			else{
				FormUIUtil.setFormCheckboxValue( TermAttributes.MANDATORY, Term.DEFAULT_MANDATORY );
			}
		}

		getValueFormValue ( save=true ){
			let value = FormUIUtil.getFormValue( TermAttributes.VALUE );
			if( save ){
				this.value = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setValueFormValue ( value ){
			if( value || value === 0 ){
				FormUIUtil.setFormValue( TermAttributes.VALUE, value );
			}
			else if( this.value || this.value === 0 ){
				FormUIUtil.setFormValue( TermAttributes.VALUE, this.value );
			}
			else{
				FormUIUtil.clearFormValue( TermAttributes.VALUE );
			}
		}
		

		setAllFormValues(){
			this.setAbstractKeyFormValue();
			this.setDefinitionFormValue();
			this.setDisplayNameFormValue();
			this.setDownloadableFormValue();
			this.setMandatoryFormValue();
			this.setSearchableFormValue();
			this.setSynonymsFormValue();
			this.setTermNameFormValue();
			this.setTermTypeFormValue();
			this.setTermVersionFormValue();
			this.setTooltipFormValue();
			this.setValueFormValue();
		}

		initAllAttributes(){

			// Audit properties
			if( !this.abstractKey ) 	this.abstractKey = Term.DEFAULT_ABSTRACT_KEY;
			if( !this.definition ) 	this.definition = null;
			if( !this.displayName ) this.displayName = null;
			if( !this.downloadable === false ) 	this.downloadable = Term.DEFAULT_DOWNLOADABLE;
			if( !this.mandatory ) 	this.mandatory = Term.DEFAULT_MANDATORY;
			if( !this.searchable ) 	this.searchable = Term.DEFAULT_SEARCHABLE;
			if( !this.state )		this.state = Term.STATE_INIT;
			if( !this.status )		this.status = Term.STATUS_DRAFT;
			if( !this.synonyms ) 	this.synonyms = '';
			if( !this.termName ) 	this.termName = '';
			if( !this.termVersion ) this.termVersion = Term.DEFAULT_TERM_VERSION;
			if( !this.tooltip ) 	this.tooltip = null;
			if( !this.value ) 		this.value = '';
			
			// These are special properties for term manipulation
			if( !this.valueMode )	this.valueMode = Term.DEFAULT_VALUE_MODE;
			if( !this.isMemberOfGroup() ) 	this.groupTermId = new TermId();
			this.standard = false;
		}

		disableAllFormControls(){
			Term.$DEFAULT_TERM_ABSTRACT_KEY_FORM_CTRL.prop( 'disabled', true );
			Term.$DEFAULT_TERM_DEFINITION_FORM_CTRL.prop( 'disabled', true );
			Term.$DEFAULT_TERM_DISPLAY_NAME_FORM_CTRL.prop( 'disabled', true );
			Term.$DEFAULT_TERM_DOWNLOADABLE_FORM_CTRL.prop( 'disabled', true );
			Term.$DEFAULT_TERM_MANDATORY_FORM_CTRL.prop( 'disabled', true );
			Term.$DEFAULT_TERM_NAME_FORM_CTRL.prop( 'disabled', true );
			Term.$DEFAULT_TERM_SEARCHABLE_FORM_CTRL.prop( 'disabled', true );
			Term.$DEFAULT_TERM_SYNONYMS_FORM_CTRL.prop( 'disabled', true );
			Term.$DEFAULT_TERM_TOOLTIP_FORM_CTRL.prop( 'disabled', true );
			Term.$DEFAULT_TERM_TYPE_FORM_CTRL.prop( 'disabled', true );
			Term.$DEFAULT_TERM_VALUE_FORM_CTRL.prop( 'disabled', true );
			Term.$DEFAULT_TERM_VERSION_FORM_CTRL.prop( 'disabled', true );
		}
		
	} // End of Term
	
	/* 1. String */
	class StringTerm extends Term {
		static DEFAULT_MIN_LENGTH = 1;
		static DEFAULT_MAX_LENGTH = 72;
		static DEFAULT_MULTIPLE_LINE = false;
		static DEFAULT_VALIDATION_RULE = '^[\w\s!@#\$%\^\&*\)\(+=._-]*$';

		constructor( jsonObj ){
			super( 'String' );

			jsonObj ? this.parse( jsonObj ) : this.initAllAttributes();

			this.setAllFormValues();
		}
		
		removeActiveTerm( term ){
			return null;
		} 

		setLocalizedMap ( attrName, controlId ){
			
			defaultLocales.forEach( function( locale ) {
				let localizedInputId = NAMESPACE+id+'_'+locale;
				
				this.localizedMap[locale] = $('#localizedInputId').val();
			});
			
			return this.localizedMap;
		}
		
		
		toJSON(){
			let json = super.toJSON();
			
			if( this.placeHolder )
				json.placeHolder = this.placeHolder.getLocalizedMap();
			if( this.minLength > StringTerm.DEFAULT_MIN_LENGTH )		
				json.minLength = this.minLength;
			if( this.maxLength !== StringTerm.DEFAULT_MAX_LENGTH )		
				json.maxLength = this.maxLength;
			if( this.multipleLine !== StringTerm.DEFAULT_MULTIPLE_LINE)	
				json.multipleLine = this.multipleLine;
			if( this.validationRule !== StringTerm.DEFAULT_VALIDATION_RULE )
				json.validationRule = this.validationRule;
			
			return json;
		}
		
		parse( json ){
			let unparsed = super.parse( json );
			let unvalid = new Object();
			
			let self = this;
			Object.keys( unparsed ).forEach( (key, index) => {
				switch( key ){
					case 'minLength':
					case 'maxLength':
					case 'multipleLine':
					case 'validationRule':
						self[key] = unparsed[key];
						break;
					case 'placeHolder':
						self.placeHolder = new LocalizedObject( unparsed[key] );
						break;
					default:
						console.log('Un-identified Attribute: '+key);
						unvalid[key] = unparsed[key];
				}
			});

			return unvalid;
		}
		
		/**
		 * Render term UI for preview
		 */
		$render( forWhat ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			this.$rendered = FormUIUtil.$getFormStringSection(
				this,
				forWhat
			);

			return this.$rendered;
		}

		$render_Freemarker( renderInputUrl, forWhat ){
			let params = Liferay.Util.ns(NAMESPACE, {
				controlType: 'string',
				renderType: forWhat ? forWhat : false,
				controlName: NAMESPACE+this.termName,
				label: this.getLocalizedDisplayName(),
				required: this.mandatory ? this.mandatory : false,
				inputType: this.multipleLine ? 'textarea' : 'text',
				placeHolder: this.getLocalizedPlaceHolder() ? this.getLocalizedPlaceHolder() : '',
				value: this.value ? this.value : '',
				helpMessage: this.getLocalizedTooltip() ? this.getLocalizedTooltip() : ''
			});

			return FormUIUtil.$getRenderedFormControl( renderInputUrl, params );
		}

		renderEditControl(){
			return null;
		}

		getLocalizedPlaceHolder(){
			if( !this.placeHolder || this.placeHolder.isEmpty() ){
				return false;
			}
			else{
				const placeHolder = this.placeHolder.getText(CURRENT_LANGUAGE);
				return placeHolder ? placeHolder : this.placeHolder.getText(DEFAULT_LANGUAGE);
			}
		}

		getPlaceHolderFormValue ( save ){
			let valueMap = FormUIUtil.getFormLocalizedValue( TermAttributes.PLACE_HOLDER );

			if( save ){
				if( Object.keys( valueMap ).length <= 0 ){
					this.placeHolder = null;
				}
				else{
					this.placeHolder = new LocalizedObject();
					this.placeHolder.setLocalizedMap( valueMap );
				}
				this.setDirty( true );
			}
			
			return valueMap;
		}
		setPlaceHolderFormValue ( valueMap ){
			if( valueMap ){
				FormUIUtil.setFormLocalizedValue( TermAttributes.PLACE_HOLDER, valueMap );
			}
			else if( this.placeHolder ){
				FormUIUtil.setFormLocalizedValue( TermAttributes.PLACE_HOLDER, this.placeHolder.getLocalizedMap() );
			}
			else{
				FormUIUtil.setFormLocalizedValue( TermAttributes.PLACE_HOLDER );
			}
		}

		getMinLengthFormValue ( save ){
			let value = FormUIUtil.getFormValue( TermAttributes.MIN_LENGTH );
			if( save ){
				this.minLength = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setMinLengthFormValue ( value ){
			if( value && value > 0 ){
				FormUIUtil.setFormValue( TermAttributes.MIN_LENGTH, value );
			}
			else if( this.minLength ){
				FormUIUtil.setFormValue( TermAttributes.MIN_LENGTH, this.minLength );
			}
			else{
				FormUIUtil.setFormValue( TermAttributes.MIN_LENGTH, 1 );
			}
		}
		
		getMaxLengthFormValue ( save ){
			let value = FormUIUtil.getFormValue( TermAttributes.MAX_LENGTH );
			if( save ){
				this.maxLength = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setMaxLengthFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( TermAttributes.MAX_LENGTH, value );
			}
			else if( this.maxLength ){
				FormUIUtil.setFormValue( TermAttributes.MAX_LENGTH, this.maxLength );
			}
			else{
				FormUIUtil.clearFormValue( TermAttributes.MAX_LENGTH );
			}
		}
		
		getMultipleLineFormValue ( save ){
			let value = FormUIUtil.getFormCheckboxValue( TermAttributes.MULTIPLE_LINE );
			if( save ){
				this.multipleLine = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setMultipleLineFormValue ( value ){
			if( value ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.MULTIPLE_LINE, value );
			}
			else if( this.multipleLine ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.MULTIPLE_LINE, this.multipleLine );
			}
			else{
				FormUIUtil.setFormCheckboxValue( TermAttributes.MULTIPLE_LINE, StringTerm.DEFAULT_MULTIPLE_LINE );
			}
		}
		
		getValidationRuleFormValue ( save ){
			let value = FormUIUtil.getFormValue( TermAttributes.VALIDATION_RULE );
			if( save ){
				this.validationRule = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setValidationRuleFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( TermAttributes.VALIDATION_RULE, value );
			}
			else if( this.validationRule ){
				FormUIUtil.setFormValue( TermAttributes.VALIDATION_RULE, this.validationRule );
			}
			else{
				FormUIUtil.clearFormValue( TermAttributes.VALIDATION_RULE );
			}
		}
		
		setAllFormValues(){
			super.setAllFormValues();
			
			this.setPlaceHolderFormValue();
			this.setMinLengthFormValue();
			this.setMaxLengthFormValue();
			this.setMultipleLineFormValue();
			this.setValidationRuleFormValue();
		}

		initAllAttributes(){
			super.initAllAttributes( 'String' ); 
			if( !this.minLength )	this.minLength = StringTerm.DEFAULT_MIN_LENGTH;
			if( !this.maxLength )	this.maxLength = StringTerm.DEFAULT_MAX_LENGTH;
			if( !this.multipleLine ) this.multipleLine = StringTerm.DEFAULT_MULTIPLE_LINE;
			if( !this.validationRule ) this.validationRule = StringTerm.DEFAULT_VALIDATION_RULE;
			if( !this.placeHolder ) this.placeHolder = '';
		}

		disableAllFormControls(){
		}
		
		validation(){
			
		}
	}
	
	/* 2. NumericTerm */
	class NumericTerm extends Term{
		constructor( jsonObj ){
			super('Numeric');

			jsonObj ? this.parse( jsonObj ) : this.initAllAttributes();
			
			this.setAllFormValues();
		}

		removeActiveTerm( term ){
			return null;
		} 
		
		$render( forWhat ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			this.$rendered = FormUIUtil.$getFormNumericSection( 
										this,
										this.getLocalizedDisplayName(),
										this.getLocalizedTooltip() ? this.getLocalizedTooltip() : '',
										this.mandatory ? this.mandatory : false,
										this.value ? this.value : '',
										this.minValue ? this.minValue : '',
										this.minBoundary ? this.minBoundary : false,
										this.maxValue ? this.maxValue : '',
										this.maxBoundary ? this.maxBoundary : false,
										this.unit ? this.unit : '',
										this.uncertainty ? this.uncertainty : false,
										this.uncertaintyValue ? this.uncertaintyValue : '',
										forWhat);
			
			return this.$rendered;
		}

		getMinValueFormValue ( save ){
			let value = FormUIUtil.getFormValue( TermAttributes.MIN_VALUE );
			if( save ){
				this.minValue = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setMinValueFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( TermAttributes.MIN_VALUE, value );
			}
			else if( this.minValue ){
				FormUIUtil.setFormValue( TermAttributes.MIN_VALUE, this.minValue );
			}
			else{
				FormUIUtil.clearFormValue( TermAttributes.MIN_VALUE );
			}
		}
		
		getMinBoundaryFormValue ( save ){
			let value = FormUIUtil.getFormCheckboxValue( TermAttributes.MIN_BOUNDARY );
			if( save ){
				this.minBoundary = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setMinBoundaryFormValue ( value ){
			if( value ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.MIN_BOUNDARY, value );
			}
			else if( this.minBoundary ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.MIN_BOUNDARY, this.minBoundary );
			}
			else{
				FormUIUtil.setFormCheckboxValue( TermAttributes.MIN_BOUNDARY );
			}
		}
		
		getMaxValueFormValue ( save ){
			let value = FormUIUtil.getFormValue( TermAttributes.MAX_VALUE );
			if( save ){
				this.maxValue = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setMaxValueFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( TermAttributes.MAX_VALUE, value );
			}
			else if( this.maxValue ){
				FormUIUtil.setFormValue( TermAttributes.MAX_VALUE, this.maxValue );
			}
			else{
				FormUIUtil.clearFormValue( TermAttributes.MAX_VALUE );
			}
		}
		
		getMaxBoundaryFormValue ( save ){
			let value = FormUIUtil.getFormCheckboxValue( TermAttributes.MAX_BOUNDARY );
			if( save ){
				this.maxBoundary = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setMaxBoundaryFormValue ( value ){
			if( value ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.MAX_BOUNDARY, value );
			}
			else if( this.maxBoundary ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.MAX_BOUNDARY, this.maxBoundary );
			}
			else{
				FormUIUtil.setFormCheckboxValue( TermAttributes.MAX_BOUNDARY );
			}
		}
		
		getUnitFormValue ( save ){
			let value = FormUIUtil.getFormValue( TermAttributes.UNIT );
			if( save ){
				this.unit = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setUnitFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( TermAttributes.UNIT, value );
			}
			else if( this.unit ){
				FormUIUtil.setFormValue( TermAttributes.UNIT, this.unit );
			}
			else{
				FormUIUtil.clearFormValue( TermAttributes.UNIT );
			}
		}
		
		getUncertaintyFormValue ( save ){
			let value = FormUIUtil.getFormCheckboxValue( TermAttributes.UNCERTAINTY );
			if( save ){
				this.uncertainty = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setUncertaintyFormValue ( value ){
			if( value ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.UNCERTAINTY, value );
			}
			else if( this.uncertainty ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.UNCERTAINTY, this.uncertainty );
			}
			else{
				FormUIUtil.setFormCheckboxValue( TermAttributes.UNCERTAINTY );
			}
		}

		getSweepableFormValue ( save ){
			let value = FormUIUtil.getFormCheckboxValue( TermAttributes.SWEEPABLE );
			if( save ){
				this.sweepable = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setSweepableFormValue ( value ){
			if( value ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.SWEEPABLE, value );
			}
			else if( this.sweepable ){
				FormUIUtil.setFormCheckboxValue( TermAttributes.SWEEPABLE, this.sweepable );
			}
			else{
				FormUIUtil.setFormCheckboxValue( TermAttributes.SWEEPABLE );
			}
		}

		getNumericPlaceHolderFormValue ( save=true ){
			let valueMap = FormUIUtil.getFormLocalizedValue( TermAttributes.NUMERIC_PLACE_HOLDER );

			if( save ){
				if( Object.keys( valueMap ).length <= 0 ){
					this.placeHolder = null;
				}
				else{
					this.placeHolder = new LocalizedObject();
					this.placeHolder.setLocalizedMap( valueMap );
				}
				this.setDirty( true );
			}
			
			return valueMap;
		}
		setNumericPlaceHolderFormValue ( valueMap ){
			if( valueMap ){
				FormUIUtil.setFormLocalizedValue( TermAttributes.NUMERIC_PLACE_HOLDER, valueMap );
			}
			else if( this.placeHolder ){
				FormUIUtil.setFormLocalizedValue( TermAttributes.NUMERIC_PLACE_HOLDER, this.placeHolder.getLocalizedMap() );
			}
			else{
				FormUIUtil.setFormLocalizedValue( TermAttributes.NUMERIC_PLACE_HOLDER );
			}
		}
		
		setAllFormValues(){
			super.setAllFormValues();
			this.setMinValueFormValue();
			this.setMinBoundaryFormValue();
			this.setMaxValueFormValue();
			this.setMaxBoundaryFormValue();
			this.setUnitFormValue();
			this.setUncertaintyFormValue();
			this.setSweepableFormValue();
			this.setNumericPlaceHolderFormValue();
		}

		initAllAttributes(){
			super.initAllAttributes( 'Numeric' );

			if( !this.minValue )	this.minValue = null;
			if( !this.minBoundary )	this.minBoundary = false;
			if( !this.maxValue )	this.maxValue = null;
			if( !this.maxBoundary )	this.maxBoundary = false;
			if( !this.unit )		this.unit = null;
			if( !this.uncertainty )	this.uncertainty = false;
			if( !this.sweepable )	this.sweepable = false;
			if( !this.placeHolder )	this.placeHolder = new LocalizedObject();
		}
		
		parse( json ){
			let unparsed = super.parse( json );
			let invalid = new Object();

			let self = this;
			Object.keys( unparsed ).forEach((key, index)=>{
				switch( key ){
					case 'minValue':
					case 'minBoundary':
					case 'maxValue':
					case 'maxBoundary':
					case 'unit':
					case 'uncertainty':
					case 'sweepable':
						self[key] = json[key];
						break;
					case 'placeHolder':
						self.placeHolder = new LocalizedObject( unparsed[key] );
						break;
					default:
						invalid[key] = json[key];
				}
			});
		}
		
		toJSON(){
			let json = super.toJSON();
			
			if( this.minValue )	json.minValue = this.minValue;
			if( this.minBoundary )	json.minBoundary = true;
			if( this.maxValue )	json.maxValue = this.maxValue;
			if( this.maxBoundary )	json.maxBoundary = true;
			if( this.unit )	json.unit = this.unit;
			if( this.uncertainty )	json.uncertainty = true;
			if( this.sweepable )	json.sweepable = true;
			if( this.placeHolder ){
				json.placeHolder = this.placeHolder.getLocalizedMap();
			}

			return json;

		}

	}
	
	/* 3. ListTerm */
	class ListTerm extends Term {
		static $DISPLAY_STYLE_FORM_CONTROL = $('#'+NAMESPACE+'listDisplayStyle');
		static $OPTION_TABLE = $('#'+NAMESPACE+'options');
		static $OPTION_LABEL = $('#'+NAMESPACE+'optionLabel');
		static $OPTION_VALUE = $('#'+NAMESPACE+'optionValue');
		static $OPTION_SELECTED = $('#'+NAMESPACE+'optionSelected');
		static $OPTION_ACTIVE_TERMS = $('#'+NAMESPACE+'activeTerms');
		static $BTN_ADD_OPTION = $('#'+NAMESPACE+'btnAddOption');
		static $BTN_NEW_OPTION = $('#'+NAMESPACE+'btnNewOption');
		static $BTN_CHOOSE_ACTIVE_TERMS = $('#'+NAMESPACE+'btnListChooseActiveTerms');

		constructor( jsonObj ){
			super('List');

			jsonObj ? this.parse(jsonObj) : this.initAllAttributes();

			this.setAllFormValues();
		}

		highlightOptionPreview(){
			let rows = $.makeArray( ListTerm.$OPTION_TABLE.children('tr') );
			rows.forEach((row, index) => { 
				$(row).removeClass( 'highlight-border' );
				if( this.highlightedOption && this.highlightedOption === this.options[index] ){
					$(row).addClass( 'highlight-border' );
				}
			});
		}

		/**********************************************************
		 * 1. Read all values from Form
		 * 2. Create ListOption instancec with the values
		 * 3. Push the instance at the options array
		 * 4. Render a preview row of the instance and add to the preview table
		 * 5. 
		 */
		addOption( option ){
			let optionLabelMap;
			let optionValue;
			let selected;
			let activeTerms;

			if( option ){
				optionLabelMap = option.labelMap;
				optionValue = option.value;
				selected = option.selected;
				activeTerms = option.activeTerms;
			}
			else{
				optionLabelMap = this.getOptionLabelFormValue();
				optionValue = this.getOptionValueFormValue();
				selected = this.getOptionSelectedFormValue();
				activeTerms = new Array();

				if( !optionLabelMap || 
					Object.keys(optionLabelMap).length === 0 ||
					!optionValue ){
					$.alert( 'Option Label and Option Value are required.' );
					return null;
				}
			}

			if( selected === true ){
				this.clearSelectedOption();
			}

			let newOption = new ListOption( optionLabelMap, optionValue, selected, new Array() );

			this.options.push(newOption);

			let $row = newOption.$renderPreview();

			ListTerm.$OPTION_TABLE.append( $row ); 

			this.highlightedOption = newOption;

			this.highlightOptionPreview();

			this.setDirty( true );

			return this.highlightedOption;
		}

		getHighlightedOption(){
			return this.highlightedOption;
		}

		updateDependentTerms(){
			if( !this.options )	return;
			this.dependentTerms = new Array();

			this.options.forEach((option)=>{
				if( option.activeTerms ){
					option.activeTerms.forEach((activeTerm)=>{
						if( !this.dependentTerms.includes( activeTerm ) ){
							this.dependentTerms.push(activeTerm);
						}
					});
				}
			});
			this.setDirty( true );
		}

		clearSelectedOption(){
			this.options.forEach((option, index)=>{
				if( option !== this.highlightedOption ){
					option.selected = false;
					ListTerm.$OPTION_TABLE.find('tr:nth-child('+(index+1)+') td.option-selected').empty();
				}
			});
			this.setDirty( true );
		}

		removeOption( optionValue ){
			this.options = this.options.filter(
				(option, index, ary) => { 
					if( option.value === optionValue ){
						ListTerm.$OPTION_TABLE.find('tr:nth-child('+(index+1)+')').remove();

						let newIndex = index;
						this.highlightedOption = null;
						if( index === (ary.length - 1) ){
							newIndex = ary.length - 2;
						}
						else{
							newIndex = index + 1;
						}
						
						if( newIndex >= 0 ){
							this.highlightedOption = this.options[newIndex];
						}

						return false;
					}

					return true;
				});
			this.setDirty( true );
			
			this.initOptionFormValues(this.highlightedOption);

			if( this.options.length === 0 ){
				ListTerm.$BTN_ADD_OPTION.prop('disabled', false );
			}

		}

		setOptionLabelMap( labelMap ){
			if( this.highlightedOption ){
				this.highlightedOption.setLabelMap( labelMap );
				this.refreshOptionPreview( 'label' );
			}
			this.setDirty( true );
		}

		setOptionValue( value ){
			if( this.highlightedOption ){
				this.highlightedOption.value = value;
				this.refreshOptionPreview('value');
			}
			this.setDirty( true );
		}

		setOptionSelected( value ){
			if( this.highlightedOption ){
				this.highlightedOption.selected = value;
				this.refreshOptionPreview('selected');
			}
		}

		getOption( optionValue ){
			return this.options.filter((option)=>option.value===optionValue)[0];
		}

		getOptionActiveTerms( optionValue ){
			let option = this.getOption(optionValue);
			return option.activeTerms;
		}

		setActiveTerms( terms ){
			
			if( !this.highlightedOption ){
				return;
			}

			this.highlightedOption.activeTerms = terms;
			this.updateDependentTerms();
		}

		removeActiveTerm( term ){
			this.options.every((option)=>{
				option.removeActiveTerm( term );
			});
			this.setDirty( true );
		} 

		refreshOptionPreview( column ){
			if( !this.highlightedOption )	return;

			this.options.every((option, index, ary)=>{
				if( option === this.highlightedOption ){
					switch( column ){
						case 'label':
							ListTerm.$OPTION_TABLE.find('tr:nth-child('+(index+1)+') td.option-label' )
									.empty()
									.text( this.highlightedOption.labelMap[CURRENT_LANGUAGE] );
							break;
						case 'value':
							ListTerm.$OPTION_TABLE.find('tr:nth-child('+(index+1)+') td.option-value' )
									.empty()
									.text( this.highlightedOption.value );
							break;
						case 'selected':
							let selectedOption = ListTerm.$OPTION_TABLE.find('tr:nth-child('+(index+1)+') td.option-selected' ).empty();
							if( this.highlightedOption.selected ){
								this.clearSelectedOption();
								selectedOption.html('&#10004;');
							}
							
							break;
					}
					
					return SXConstants.STOP_EVERY;
				}

				return SXConstants.CONTINUE_EVERY;
			})
		}

		renderOptions(){
			let $panel = ListTerm.$OPTION_TABLE;
			$panel.empty();

			this.options.forEach((option)=>{
				$panel.append( option.$renderPreview() );
			});
		}

		$render( forWhat ){
			this.updateDependentTerms();
			
			let options = new Array();
			this.options.forEach((option)=>{
				let rOption = {};
				
				rOption.label = option.labelMap[CURRENT_LANGUAGE];
				rOption.value = option.value;
				rOption.selected = option.selected;
				rOption.activeTerms = option.activeTerms;
				rOption.inactiveTerms = this.dependentTerms.filter((term)=>!option.activeTerms.includes(term));
				
				options.push( rOption );
			});
			
			if( this.$rendered ){
				this.$rendered.remove();
			}
			
			this.$rendered = FormUIUtil.$getFormListSection(
									this,
									this.getLocalizedDisplayName(),
									this.getLocalizedTooltip() ? this.getLocalizedTooltip() : '',
									this.mandatory ? this.mandatory : false,
									this.value ? this.value : '',
									this.displayStyle,
									this.options,
									this.dependentTerms,
									forWhat );
			
			return this.$rendered;
		}

		initAllAttributes(){
			super.initAllAttributes( 'List' );

			if( !this.options )			this.options = new Array();
			if( !this.displayStyle )	this.displayStyle = 'select';
			if( !this.dependentTerms )	this.dependentTerms = new Array();

			ListTerm.$OPTION_TABLE.empty();
			ListTerm.$OPTION_ACTIVE_TERMS.empty();
		}

		getDisplayStyleFormValue ( save ){
			let value = FormUIUtil.getFormRadioValue( 'listDisplayStyle' );
			if( save ){
				this.displayStyle = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setDisplayStyleFormValue ( value ){
			if( value ){
				FormUIUtil.setFormRadioValue( 'listDisplayStyle', value );
			}
			else if( this.displayStyle ){
				FormUIUtil.setFormRadioValue( 'listDisplayStyle', this.displayStyle );
			}
			else{
				FormUIUtil.setFormRadioValue( 'listDisplayStyle' );
			}
		}

		getOptionLabelFormValue (){
			return FormUIUtil.getFormLocalizedValue( 'optionLabel' );
		}
		setOptionLabelFormValue ( valueMap ){
			if( valueMap ){
				FormUIUtil.setFormLocalizedValue( 'optionLabel', valueMap );
			}
			else if( this.highlightedOption && this.highlightedOption.labelMap ){
				FormUIUtil.setFormLocalizedValue( 'optionLabel', this.highlightedOption.labelMap );
			}
			else{
				FormUIUtil.setFormLocalizedValue( 'optionLabel' );
			}
		}

		getOptionValueFormValue (){
			return FormUIUtil.getFormValue( 'optionValue' );
		}
		setOptionValueFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( 'optionValue', value );
			}
			else if( this.highlightedOption && this.highlightedOption.value ){
				FormUIUtil.setFormValue( 'optionValue', this.highlightedOption.value );
			}
			else{
				FormUIUtil.setFormValue( 'optionValue' );
			}
		}

		getOptionSelectedFormValue (){
			return FormUIUtil.getFormCheckboxValue( 'optionSelected' );
		}
		setOptionSelectedFormValue ( value ){
			if( value ){
				FormUIUtil.setFormCheckboxValue( 'optionSelected', value );
			}
			else if( this.highlightedOption && this.highlightedOption.selected ){
				FormUIUtil.setFormCheckboxValue( 'optionSelected', this.highlightedOption.selected );
			}
			else{
				FormUIUtil.setFormCheckboxValue( 'optionSelected' );
			}
		}

		getActiveTermsFormValue (){
			let value = FormUIUtil.getFormCheckedArray( 'activeTerms' );
			
			return value;
		}
		setActiveTermsFormValue ( terms ){
			let termNames = null;
			
			if( terms ){
				termNames = terms.map(term=>term.termName);
			}

			if( termNames ){
				FormUIUtil.setFormCheckedArray( 'activeTerms', termNames );
			}
			else if( this.highlightedOption && this.highlightedOption.activeTerms ){
				let activeTermNames = this.highlightedOption.activeTerms.map(activeTerm=>activeTerm.termName);
				FormUIUtil.setFormCheckedArray( 'activeTerms', this.highlightedOption.activeTerms );
			}
			else{
				FormUIUtil.setFormCheckedArray( 'activeTerms' );
			}
		}

		setAllFormValues(){
			super.setAllFormValues();
			
			this.renderOptions();
			this.initOptionFormValues();
		}

		initOptionFormValues( option ){
			if( !option ){
				this.highlightedOption = null;	
			}
			else{
				this.highlightedOption = option;
			}
			
			this.setOptionLabelFormValue();
			this.setOptionValueFormValue();
			this.setOptionSelectedFormValue();
			this.setActiveTermsFormValue();

			this.highlightOptionPreview();
		}

		parse( json ){
			let unparsed = super.parse( json );
			let unvalid = new Object();

			let self = this;
			Object.keys( unparsed ).forEach((key)=>{
				switch(key){
					case 'displayStyle':
					case 'dependentTerms':
						self[key] = json[key];
						break;
					case 'options':
						if( typeof json.options === 'string' ){
							json.options = JSON.parse( json.options );
						}
	
						self.options = new Array();
						json.options.forEach(option => self.addOption(option));
						break;
					default:
						unvalid[key] = json[key];
						console.log('Unvalid term attribute: '+key, json[key]);
				}
			});
		}
		
		toJSON(){
			let json = super.toJSON();
			
			json.displayStyle = this.displayStyle;
			json.options = this.options.map(option=>option.toJSON());
			
			return json;
		}
	}
	
	/* 5. EMailTerm */
	class EMailTerm  extends Term{
		constructor(){
			
		}
	}
	
	/* 6. AddressTerm */
	class AddressTerm extends Term{
		constructor(){
			
		}
	}

	/* 7. ArrayTerm */
	class ArrayTerm extends Term{
		constructor(){
			
		}
	}
	
	/* 8. MatrixTerm */
	class MatrixTerm extends Term{
		constructor(){
			
		}
	}
	
	/* 9. ObjectTerm */
	class ObjectTerm extends Term{
		constructor(){
			
		}
	}
	
	/* 10. ObjectArrayTerm */
	class ObjectArrayTerm extends Term{
		constructor(){
			
		}
	}


	/* 11. PhoneTerm */
	class PhoneTerm extends Term{
		constructor(){
			
		}
	}
	
	/* 12. DateTerm */
	class DateTerm extends Term{
		static $DEFAULT_ENABLE_TIME_FORM_CTRL = $('#'+NAMESPACE+'enableTime');
		static DEFAULT_ENABLE_TIME=false;
		static DEFAULT_SIZE = '200px';
		static TIME_ENABLED_SIZE = '500px';

		constructor( jsonObj ){
			super('Date');

			jsonObj ? this.parse( jsonObj ) : this.initAllAttributes();

			this.setAllFormValues();
		}

		$render(forWhat=SXConstants.FOR_EDITOR){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			this.$rendered = FormUIUtil.$getFormDateSection(
				this,
				forWhat
			);

			//this.$rendered.find('input').eq(0).datetimepicker();

			return this.$rendered;
		}
		
		getFormValue( save ){
			let value = $('#'+NAMESPACE+this.termName).val();
			if( save ){
				this.value = value;
			}
			
			return value;
		}

		setFormValue( value ){
			if( value ){
				this.value = value;
			}

			this.value ? 
				$('#'+NAMESPACE+this.termName).val( this.value ) :
				$('#'+NAMESPACE+this.termName).val( '' );
		}

		setAllFormValues(){
			super.setAllFormValues();

			this.setEnableTimeFormValue();
		}

		initAllAttributes(){
			super.initAllAttributes( 'Date' );

			this.$rendered = null;

			if( !this.enableTime ) 	this.enableTime = DateTerm.DEFAULT_ENABLE_TIME;
		}

		getEnableTimeFormValue(save=true){
			let value = FormUIUtil.getFormCheckboxValue( 'enableTime' );
			
			if( save ){
				this.enableTime = value;
				this.setDirty( true );
			}
			
			return value;
		}

		setEnableTimeFormValue( value ){
			if( value ){
				this.enableTime = value;
			}

			FormUIUtil.setFormCheckboxValue( 'enableTime', this.enableTime ? this.enableTime : false );
		}

		parse( json ){
			let unparsed = super.parse( json );
			let unvalid = new Object();

			let self = this;
			Object.keys( unparsed ).forEach(function(key, index){
				switch( key ){
					case 'enableTime':
						self.enableTime = unparsed.enableTime;
						break;
					default:
						unvalid[key] = json[key];
				}
			});

			this.initAllAttributes();

			return unvalid;
		}

		toJSON(){
			let json = super.toJSON();
			
			if( this.enableTime )	json.enableTime = this.enableTime;
			
			return json;
		}
	}
	
	/* 13. FileTerm */
	class FileTerm extends Term{
		constructor( jsonObj ){
			super( 'File' );

			jsonObj ? this.parse( jsonObj ) : this.initAllAttributes();

			this.setAllFormValues();
		}
		
		initAllAttributes(){
			super.initAllAttributes( 'File' ); 
			this.$rendered = null;
		}

		setAllFormValues(){
			super.setAllFormValues();
		}

		getFormValue( save=true ){
			let value = $('#'+NAMESPACE+this.termName).val();
			if( save ){
				this.value = value;
			}
			
			return value;
		}

		setFormValue( value ){
			if( value ){
				this.value = value;
			}

			this.value ? 
				$('#'+NAMESPACE+this.termName).val( this.value ) :
				$('#'+NAMESPACE+this.termName).val( '' );
		}

		$render( forWhat ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			this.$rendered = FormUIUtil.$getFormFileUploadSection(
										this,
										this.getLocalizedDisplayName(),
										this.getLocalizedTooltip() ? this.getLocalizedTooltip() : '',
										this.mandatory ? this.mandatory : false,
										this.value ? this.value : '',
										forWhat );

			return this.$rendered;
		}

		parse( jsonObj ){
			let unparsed = super.parse( jsonObj );
			let unvalid = new Object();
			
			let self = this;
			Object.keys( unparsed ).forEach( (key, index) => {
				unvalid[key] = unparsed[key];
			});

			return unvalid;
		}

		toJSON(){
			return super.toJSON();
		}
	}

	/* 14. FileArrayTerm */
	class FileArrayTerm extends Term{
		constructor( jsonObj ){
			super( 'File' );

			jsonObj ? this.parse( jsonObj ) : this.initAllAttributes();

			this.setAllFormValues();
		}

		initAllAttributes(){

		}

		setAllFormValues(){

		}

		$render( forWhat ){
			if( this.$rendered ){
				this.$rendered.remove();
			}

			this.$rendered = FormUIUtil.$getFormFileSection(
										this,
										this.getLocalizedDisplayName(),
										this.getLocalizedTooltip() ? this.getLocalizedTooltip() : '',
										this.mandatory ? this.mandatory : false,
										this.value ? this.value : '',
										forWhat );

			return this.$rendered;
		}

		parse( jsonObj ){
			let unparsed = super.parse( jsonObj );
			let unvalid = new Object();
			
			let self = this;
			Object.keys( unparsed ).forEach( (key, index) => {
				unvalid[key] = unparsed[key];
			});

			return unvalid;
		}
	}

	/* 15. DataLinkTerm */
	class DataLinkTerm extends Term{
		constructor(){
			
		}
	}

	/* 16. DataLinkArrayTerm */
	class DataLinkArrayTerm extends Term{
		constructor(){
			
		}
	}

	/* 17. CommentTerm */
	class CommentTerm extends Term{
		constructor(){
			
		}
	}

	/* 18. GroupTerm */
	class GroupTerm extends Term{
		static $BTN_CHOOSE_GROUP_TERMS = $('#'+NAMESPACE+'btnChooseGroupTerms');

		constructor( jsonObj ){
			super('Group');

			if( jsonObj ){
				this.parse(jsonObj);
			}

			this.tempMembers = new Array();
		}

		$newGroupPanel(){
			this.$groupPanel = $('<tbody id="' + this.getGroupPanelId() + '">');

			return this.$groupPanel;
		}

		$getGroupPanel(){
			if( this.isRendered() ){
				return this.$groupPanel;
			}
			else{
				return this.$newGroupPanel();
			}
		}

		getGroupPanelId(){
			return NAMESPACE + this.termName+ '_'+ this.termVersion + '_GroupPanel';
		}

		/**
		 * 
		 * @param {Array} terms 
		 * @param {TermId} groupTermId 
		 * @returns 
		 */
		devideTermsByGroup( terms, groupTermId ){
			let devided = new Object();

			devided.hits = new Array();
			devided.others = new Array();

			if( Util.isEmptyArray(terms) ){
				return devided;
			}

			terms.forEach(term=>{
				if( groupTermId.sameWith(term.groupTermId) ){
					devided.hits.push( term );
				}
				else{
					devided.others.push( term );
				}
			});

			return devided;
		}

		/**
		 * 
		 * 
		 * @param {*} forWhat 
		 * @param {*} highlight 
		 * @param {*} children 
		 * @param {*} others 
		 * @returns 
		 */
		$render( members, others, forWhat, deep=true ){
			let $panel = this.$newGroupPanel();

			members.forEach(term=>{
				let $row;
				if( deep === true ){
					if( term.isGroupTerm() && !Util.isEmptyArray(others) ){
						let termSets = term.devideTermsByGroup( others, term.getTermId() );
						$row = term.$render( termSets.hits, termSets.others, forWhat ); 
					}
					else{
						$row = term.$render( forWhat );
					}
				}
				else{
					$row = term.$rendered;
				}
				
				let renderedCount = $panel.children('tr').length;
				if( term.order === 1 ){
					$panel.prepend( $row );
				}
				else if( term.order > renderedCount ){
					$panel.append( $row );
				}
				else{
					$panel.children('tr:nth-child('+term.order+')').before($row);
				}
			});

			if( this.$rendered ){
				this.$rendered.remove();
			}

			let $table = $('<table class="table table-striped">').append($panel);

			let $accordion = FormUIUtil.$getAccordionForGroup( 
											this.displayName.getText(CURRENT_LANGUAGE),
											$table);
			
			if( forWhat === SXConstants.FOR_PREVIEW ){
				this.$rendered = FormUIUtil.$getPreviewRowSection(this, $accordion);
			}
			else if( forWhat === SXConstants.FOR_EDITOR ){
				this.$rendered =  FormUIUtil.$getEditorRowSection(this, $accordion);
			}
			else{
				//Rendering for PDF here
			}

			return this.$rendered;
		}

		isRendered(){
			return this.$rendered ? true : false;
		}

		clearHighlightedChildren(){
			this.$groupPanel.find('tr.highlight').removeClass('highlight');
		}


		parse( jsonObj ){
			let unparsed = super.parse( jsonObj );
			if( !Util.isEmptyObject(unparsed) ){
				console.log('Group Term has unparsed attributes: '+ this.termName, unparsed);
			}
		}

		toJSON(){
			return super.toJSON();
		}
	}



	/* 19. BooleanTerm */
	class BooleanTerm extends Term {
		static ID_DISPLAY_STYLE = 'booleanDisplayStyle';
		static ID_TRUE_LABEL = 'booleanTrueLabel';
		static ID_FALSE_LABEL = 'booleanFalseLabel';
		static $DISPLAY_STYLE = $('#'+NAMESPACE+BooleanTerm.ID_DISPLAY_STYLE);
		static $TRUE_LABEL = $('#'+NAMESPACE+BooleanTerm.ID_TRUE_LABEL);
		static $FALSE_LABEL = $('#'+NAMESPACE+BooleanTerm.ID_FALSE_LABEL);
		static $TRUE_ACTIVE_TERMS_BUTTON = $('#'+NAMESPACE+'btnBooleanTrueActiveTerms');
		static $FALSE_ACTIVE_TERMS_BUTTON = $('#'+NAMESPACE+'btnBooleanFalseActiveTerms');
		static $FALSE_ACTIVE_TERMS_BUTTON = $('#'+NAMESPACE+'btnBooleanFalseActiveTerms');

		static DEFAULT_DISPLAY_STYLE = SXConstants.DISPLAY_STYLE_SELECT;
		static AVAILABLE_TERMS = null;

		static OPTION_FOR_TRUE = 0;
		static OPTION_FOR_FALSE = 1;

		constructor( jsonObj ){
			super('Boolean');

			jsonObj ? this.parse(jsonObj) : this.initAllAttributes();

			this.setAllFormValues();
		}

		initAllAttributes(){
			super.initAllAttributes('Boolean');

			if( !this.displayStyle )	this.displayStyle = BooleanTerm.DEFAULT_DISPLAY_STYLE;
			if( !this.options ){
				this.options = new Array();
				// for true
				this.options.push( new ListOption( {'en_US':'Yes'}, true, true, [] ) );
	
				// for false
				this.options.push( new ListOption( {'en_US':'No'}, false, false, [] ) );
				this.dependentTerms = null;
			}
		}

		updateDependentTerms(){
			this.dependentTerms = new Array();

			this.options.forEach((option)=>{
				if( option.activeTerms ){
					option.activeTerms.forEach((activeTerm)=>{
						if( !this.dependentTerms.includes( activeTerm ) ){
							this.dependentTerms.push(activeTerm);
						}
					});
				}
			});
		}

		getTrueOption(){
			return this.options[BooleanTerm.OPTION_FOR_TRUE];
		}

		getFalseOption(){
			return this.options[BooleanTerm.OPTION_FOR_FALSE]
		}

		$render( forWhat ){
			this.updateDependentTerms();
			
			let options = new Array();
			this.options.forEach((option)=>{
				let rOption = {};

				rOption.label = option.labelMap[CURRENT_LANGUAGE];
				rOption.value = option.value;
				rOption.selected = option.selected;
				rOption.activeTerms = option.activeTerms;
				rOption.inactiveTerms = this.dependentTerms.filter((term)=>!option.activeTerms.includes(term));

				options.push( rOption );
			});

			if( this.$rendered ){
				this.$rendered.remove();
			}

			this.$rendered = FormUIUtil.$getFormListSection(
									this,
									this.getLocalizedDisplayName(),
									this.getLocalizedTooltip() ? this.getLocalizedTooltip() : '',
									this.mandatory ? this.mandatory : false,
									this.value ? this.value : '',
									this.displayStyle,
									this.options,
									this.dependentTerms,
									forWhat );

			return this.$rendered;
		}


		getDisplayStyleFormValue ( save ){
			let value = FormUIUtil.getFormRadioValue( BooleanTerm.ID_DISPLAY_STYLE );
			if( save ){
				this.displayStyle = value;
				this.setDirty( true );
			}
			
			return value;
		}
		setDisplayStyleFormValue ( value ){
			if( value ){
				FormUIUtil.setFormRadioValue( BooleanTerm.ID_DISPLAY_STYLE, value );
			}
			else if( this.displayStyle ){
				FormUIUtil.setFormRadioValue( BooleanTerm.ID_DISPLAY_STYLE, this.displayStyle );
			}
			else{
				FormUIUtil.setFormRadioValue( BooleanTerm.ID_DISPLAY_STYLE );
			}
		}

		getTrueLabelFormValue (){
			let trueOption = this.options[0];
			trueOption.setLabelMap(FormUIUtil.getFormLocalizedValue( BooleanTerm.ID_TRUE_LABEL ));
			this.setDirty( true );
			return trueOption.getLabelMap();
		}
		setTrueLabelFormValue ( valueMap ){
			let trueOption = this.options[0];

			if( valueMap ){
				FormUIUtil.setFormLocalizedValue( BooleanTerm.ID_TRUE_LABEL, valueMap );
			}
			else{
				FormUIUtil.setFormLocalizedValue( BooleanTerm.ID_TRUE_LABEL, trueOption.getLabelMap() );
			}
		}

		getFalseLabelFormValue (){
			let falseOption = this.options[1];
			falseOption.setLabelMap(FormUIUtil.getFormLocalizedValue( BooleanTerm.ID_FALSE_LABEL ));
			this.setDirty( true );
			return falseOption.getLabelMap();
		}
		setFalseLabelFormValue ( valueMap ){
			let falseOption = this.options[1];

			if( valueMap ){
				FormUIUtil.setFormLocalizedValue( BooleanTerm.ID_FALSE_LABEL, valueMap );
			}
			else{
				FormUIUtil.setFormLocalizedValue( BooleanTerm.ID_FALSE_LABEL, falseOption.getLabelMap() );
			}
		}

		setAllFormValues(){
			super.setAllFormValues();
			this.initOptionFormValues();
		}

		initOptionFormValues(){
			this.setDisplayStyleFormValue();
			this.setTrueLabelFormValue();
			this.setFalseLabelFormValue();
		}

		toJSON(){
			let json = super.toJSON();

			json.displayStyle = this.displayStyle;
			json.options = this.options.map(option=>option.toJSON());

			return json;
		}

		parse( jsonObj ){
			let unparsed = super.parse( jsonObj );
			let unvalid = new Array();

			let self = this;
			Object.keys(unparsed).forEach( key => {
				switch(key){
					case 'displayStyle':
						self.displayStyle = jsonObj.displayStyle;
						break;
					case 'options':
						self.options = new Array();
						jsonObj.options.forEach( option => {
							self.options.push( new ListOption(
								option.labelMap,
								option.value,
								option.selected,
								option.activeTerms
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
	
	/* 20. IntergerTerm */
	class IntegerTerm extends NumericTerm{
		constructor(){
			super();
		}
	}

	class DataStructure {
		static $DEFAULT_PREVIEW_PANEL = $('#'+NAMESPACE+'previewPanel');
		static $DEFAULT_CANVAS = $('<iframe id='+NAMESPACE+'canvasPanel>');
		static $DEFAULT_CANVAS = $('#'+NAMESPACE+'searchCanvas');

		static $TERM_DELIMITER_FORM_CTRL = $('#'+NAMESPACE+'termDelimiter');
		static $TERM_DELIMITER_POSITION_FORM_CTRL = $('#'+NAMESPACE+'termDelimiterPosition');
		static $TERM_VALUE_DELIMITER_FORM_CTRL = $('#'+NAMESPACE+'termValueDelimiter');
		static $MATRIX_BRACKET_TYPE_FORM_CTRL = $('#'+NAMESPACE+'matrixBracketType');
		static $MATRIX_ELEMENT_DELIMITER_FORM_CTRL = $('#'+NAMESPACE+'matrixElementDelimiter');
		static $COMMENT_CHAR_FORM_CTRL = $('#'+NAMESPACE+'commentChar');
		static FORM_RENDER_URL = '';

		static DEFAULT_TERM_DELIMITER = '';
		static DEFAULT_TERM_DELIMITER_POSITION = true;
		static DEFAULT_TERM_VALUE_DELIMITER = '=';
		static DEFAULT_MATRIX_BRACKET_TYPE = '[]';
		static DEFAULT_MATRIX_ELEMENT_DELIMITER = ' ';
		static DEFAULT_COMMENT_CHAR = '#';

		constructor( jsonObj ){
			if( !Util.isEmptyObject(jsonObj) ){
				this.parse( jsonObj );
			}
			else{
				this.termDelimiter= DataStructure.DEFAULT_TERM_DELIMITER;
				this.termDelimiterPosition = DataStructure.DEFAULT_TERM_DELIMITER_POSITION;
				this.termValueDelimiter = DataStructure.DEFAULT_TERM_VALUE_DELIMITER;
				this.matrixBracketType = DataStructure.DEFAULT_MATRIX_BRACKET_TYPE;
				this.matrixElementDelimiter = DataStructure.DEFAULT_MATRIX_ELEMENT_DELIMITER;
				this.commentString = DataStructure.DEFAULT_COMMENT_CHAR;

				this.tooltip = new LocalizedObject();
				this.terms = new Array();
			}

			this.dirty = false;
			this.uploadFiles = false;
			this.$canvas = null;
			this.forWhat = SXConstants.FOR_NOTHING;

			this.selectedTerm = null;
		}
		
		/***********************************************************************
		 *  APIs for form controls
		 ***********************************************************************/

		getTermDelimiterFormValue ( save=true ){
			let value = FormUIUtil.getFormValue( 'termDelimiter' );
			if( save ){
				this.termDelimiter = value;
			}
			
			return value;
		}
		setTermDelimiterFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( 'termDelimiter', value );
			}
			else if( this.termDelimiter ){
				FormUIUtil.setFormValue( 'termDelimiter', this.termDelimiter );
			}
			else{
				FormUIUtil.clearFormValue( 'termDelimiter' );
			}
		}

		getTermDelimiterPositionFormValue ( save=true ){
			let value = FormUIUtil.getFormValue( 'termDelimiterPosition' );
			if( save ){
				this.termDelimiter = value;
			}
			
			return value;
		}
		setTermDelimiterPositionFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( 'termDelimiterPosition', value );
			}
			else if( this.termDelimiterPosition ){
				FormUIUtil.setFormValue( 'termDelimiterPosition', this.termDelimiterPosition );
			}
			else{
				FormUIUtil.clearFormValue( 'termDelimiterPosition' );
			}
		}
		
		getTermValueDelimiterFormValue ( save=true ){
			let value = FormUIUtil.getFormValue( 'termValueDelimiter' );
			if( save ){
				this.termDelimiter = value;
			}
			
			return value;
		}
		setTermValueDelimiterFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( 'termValueDelimiter', value );
			}
			else if( this.termValueDelimiter ){
				FormUIUtil.setFormValue( 'termValueDelimiter', this.termValueDelimiter );
			}
			else{
				FormUIUtil.clearFormValue( 'termValueDelimiter' );
			}
		}
		
		getMatrixBracketTypeFormValue ( save=true ){
			let value = FormUIUtil.getFormValue( 'matrixBracketType' );
			if( save ){
				this.matrixBracketType = value;
			}
			
			return value;
		}
		setMatrixBracketTypeFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( 'matrixBracketType', value );
			}
			else if( this.matrixBracketType ){
				FormUIUtil.setFormValue( 'matrixBracketType', this.matrixBracketType );
			}
			else{
				FormUIUtil.clearFormValue( 'matrixBracketType' );
			}
		}

		getMatrixElementDelimiterFormValue ( save=true ){
			let value = FormUIUtil.getFormValue( 'matrixElementDelimiter' );
			if( save ){
				this.matrixElementDelimiter = value;
			}
			
			return value;
		}
		setMatrixElementDelimiterFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( 'matrixElementDelimiter', value );
			}
			else if( this.matrixElementDelimiter ){
				FormUIUtil.setFormValue( 'matrixElementDelimiter', this.matrixElementDelimiter );
			}
			else{
				FormUIUtil.clearFormValue( 'matrixElementDelimiter' );
			}
		}
		
		getCommentCharFormValue ( save=true ){
			let value = FormUIUtil.getFormValue( 'commentChar' );
			if( save ){
				this.commentChar = value;
			}
			
			return value;
		}
		setCommentCharFormValue ( value ){
			if( value ){
				FormUIUtil.setFormValue( 'commentChar', value );
			}
			else if( this.matrixElementDelimiter ){
				FormUIUtil.setFormValue( 'commentChar', this.commentChar );
			}
			else{
				FormUIUtil.clearFormFormValue( 'commentChar' );
			}
		}

		replaceVisibleTypeSpecificSection( termType ){
			FormUIUtil.replaceVisibleTypeSpecificSection( termType );
		}

		/**
		 * Disable or enable form controls
		 * 
		 * @param {['string']} controlIds 
		 * @param {'booelan'} disable 
		 */
		disable( controlIds, disable=true ){
			FormUIUtil.disableControls( controlIds, disable );
		}

		

		/*****************************************************************
		 * APIs for DataStructure instance
		 *****************************************************************/
		
		loadDataStructure( url, paramData ){
			let params = Liferay.Util.ns( NAMESPACE, paramData);
			
			$.ajax({
				url: url,
				method: 'post',
				data: params,
				dataType: 'json',
				success: function( dataStructure ){
					parse( dataStruture );
				},
				error: function( data, e ){
					console.log(data);
					console.log('AJAX ERROR-->' + e);
				}
			});
		}
		
		createTerm( termType ){
			switch( termType ){
			case 'String':
				return new StringTerm();
			case 'Numeric':
				return new NumericTerm();
			case 'Integer':
				return new IntegerTerm();
			case 'List':
				return new ListTerm();
			case 'Boolean':
				return new BooleanTerm();
			case 'Array':
				return new ArrayTerm();
			case 'EMail':
				return new EMailTerm();
			case 'Date':
				return new DateTerm();
			case 'Address':
				return new AddressTerm();
			case 'Phone':
				return new PhoneTerm();
			case 'Matrix':
				return new MatrixTerm();
			case 'Object':
				return new ObjectTerm();
			case 'ObjectArray':
				return new ObjectArrayTerm();
			case 'File':
				return new FileTerm();
			case 'FileArray':
				return new FileArrayTerm();
			case 'DataLink':
				return new FileTerm();
			case 'DataLinkArray':
				return new DataLinkArrayTerm();
			case 'Comment':
				return new CommentTerm();
			case 'Group':
				return new GroupTerm();
			default:
				return new StringTerm();
			}
		}

		copyTerm( term ){
			let copied = Object.assign( this.createTerm(term.termType), term );

			copied.termName = '';
			// this.selectedTerm = null;

			console.log( 'Copied Term: ', copied );

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
				if( termId.sameWith( term.getTermId() ) ){
					searchedTerm = term;
					return SXConstants.STOP_EVERY;
				}

				return SXConstants.CONTINUE_EVERY;
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
					return SXConstants.STOP_EVERY;
				}

				return SXConstants.CONTINUE_EVERY;
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
		 */
		getGroupMembers( groupTermId ){
			if( Util.isEmptyArray(this.terms) ){
				return [];
			}

			if( !groupTermId ){
				groupTermId = this.getTermId();
			}

			let members = this.terms.filter( term => {
				if( groupTermId.isEmpty() && !term.isMemberOfGroup() ){
					return SXConstants.FILTER_ADD;
				}
				else if( term.isMemberOfGroup() && 
						 groupTermId.isNotEmpty() &&
						 groupTermId.sameWith(term.groupTermId) ){
					return SXConstants.FILTER_ADD;
				}
				else{
					return SXConstants.FILTER_SKIP;
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
				console.log( '[ERROR:getTermsByOrder] Range Violation: '+order);
				return null;
			}

			children.every(child=>{
				if( child.order === order ){
					searchedTerm = child;
					return SXConstants.STOP_EVERY;
				}

				return SXConstants.CONTINUE_EVERY;
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

			let $panel = this.$getPreviewPanel( term.groupTermId );

			if( term.order === 1 ){
				$panel.prepend(term.$rendered); 
			}
			else{
				$panel.children( 'tr:nth-child('+term.order+')' ).before( term.$rendered );
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

			let $panel = this.$getPreviewPanel( term.groupTermId );

			if( switchedTerm.order === 1 ){
				$panel.prepend(switchedTerm.$rendered); 
			}
			else{
				$panel.children( 'tr:nth-child('+switchedTerm.order+')' ).before( switchedTerm.$rendered );
			}
		}

		setGroupIncrementalOrder( term ){
			let terms = this.getGroupMembers( term.groupTermId );
			console.log('------', term, terms);
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
					self.refreshGroupMemberOrders( term.getTermId() );
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
					term.isMemberOfGroup() && 
					!term.groupTermId.sameWith(groupTerm.getTermId()) ){
					return;
				}

				let selected;
				if( groupTerm.isRendered() ){
					selected = term.groupTermId.sameWith( groupTerm.getTermId() );
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
					false ) );
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
							console.log( 'Choose groupTerm termNameSet: ', termNameSet );
							// there could be rendered children.
							let oldMembers = self.getGroupMembers(groupTerm.getTermId());
							oldMembers = oldMembers.filter( member=>{
								if( !termNameSet.includes(member.termName) ){
									self.addGroupMember( member, groupTerm.groupTermId, false);
									return SXConstants.FILTER_SKIP;
								}

								return SXConstants.FILTER_ADD;
							});
							console.log( 'Choose groupTerm oldMembers: ', oldMembers );

							termNameSet.forEach(termName=>{
								let term = self.getTermByName( termName );
								if( oldMembers.includes(term) ){
									return;
								}

								if( groupTerm.isRendered() ){
									console.log( 'Choose groupTerm : Should be here!!!', term );
									self.addGroupMember( term, groupTerm.getTermId(), false );
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
				$rendered = this.$renderTerm( term, SXConstants.FOR_PREVIEW );
			}

			this.$getPreviewPanel( newGroupTermId ).append( $rendered );

			return term;
		}

		$getPreviewPanel( groupTermId ){
			let groupTerm = this.getTerm( groupTermId );

			return groupTerm === null ? 
						DataStructure.$DEFAULT_PREVIEW_PANEL : 
						groupTerm.$getGroupPanel();
		}

		/********************************************************
		 *  APIs related with ListTerm
		 ********************************************************/

		chooseActiveTerms( targetTerm, targetOption ){
			if( !this.terms || this.terms.length === 0 ){
				return null;
			}

			targetTerm.updateDependentTerms();

			let $activeTermsSelector = $('<div>');
			this.terms.forEach((term, index)=>{
				if( term === targetTerm ){
					return;
				}

				let selected = targetOption.activeTerms ? targetOption.activeTerms.includes(term) : false;
				let disabled = false;

				// Check the term is already specified as an active term from other options.
				// On that case, the checkbox for the term should be disabled.
				targetTerm.options.every((option)=>{
					if( option !== targetOption && 
						option.activeTerms && 
						option.activeTerms.includes( term ) ){
						disabled = true;

						return SXConstants.STOP_EVERY;
					}

					return SXConstants.CONTINUE_EVERY;
				});
				
				$activeTermsSelector.append( FormUIUtil.$getCheckboxTag( 
											NAMESPACE+'_term_'+(index+1),
											NAMESPACE+'activeTermsSelector',
											term.displayName.getText(CURRENT_LANGUAGE),
											selected,
											term.termName,
											disabled ) );
			});

			let self = this;
			$activeTermsSelector.dialog({
				title: 'Check Active Terms',
				autoOpen: true,
				dragglable: true,
				modal: true,
				buttons:[
					{
						text: 'Confirm', 
						click: function(){
							targetOption.activeTerms = FormUIUtil.getFormCheckedArray('activeTermsSelector').map(termName=>self.getTerm);
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

		
		/*******************************************************************
		 * Add a term to the data structure. If preview is true, 
		 * than the term will be previewd on the preview panel which is 
		 * specified when the data structure instance was created.
		 *  
		 *  @PARAMS
		 *  	term : Term instance to be added or inserted
		 *  	preview: boolean - preview or not
		 ********************************************************************/
		addTerm( term, baseOrder=0, forWhat=SXConstants.FOR_NOTHING, highlight=false, validate=true ){
			if( validate && term.validate() === false ){
				return false;
			}
			
			this.setOrder( term, baseOrder );

			if( !this.terms ){
				this.terms = new Array();
			}
			
			this.terms.push( term );

			if( forWhat !== SXConstants.FOR_NOTHING ){
				this.renderTerm( term, forWhat, highlight );
			}

			return true;
		}

		setOrder( term, baseOrder=0 ){
			let groupTermId = term.isMemberOfGroup() ? 
								term.groupTermId : this.getTopLevelTermId();
			let maxOrder = this.getGroupMembers( groupTermId ).length;

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
			console.log('Parent group to be moved up: ', term.groupTermId);

			this.refreshGroupMemberOrders( group.groupTermId );
			this.refreshGroupMemberOrders( term.groupTermId );
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
			let targetId = targetTerm.getTermId();
			let	groupTermId = targetTerm.groupTermId;
			
			this.terms = this.terms.filter( term => !term.getTermId().sameWith(targetId) );

			//Take care of children if targetTerm is a group
			if( targetTerm.isGroupTerm() && deep === false ){
				this.moveGroupMembers( targetId, groupTermId );
			}
			else if( targetTerm.isGroupTerm() && deep === true ){
				let members = this.getGroupMembers(targetId);
				members.forEach(member=>this.deleteTerm(member, true));
			}
			this.refreshGroupMemberOrders( groupTermId );

			if( targetTerm.isRendered() ){
				targetTerm.emptyRender();
			}
		}

		deleteTermById( termId, deep ){
			let targetTerm = this.getTerm(termId);
			this.deleteTerm(targetTerm, deep);
		}

		/**
		 * Remove term from the data structure when the term is not included
		 * in a GroupTerm. If the term is included in a GroupTerm, the term is
		 * removed from the Group and appened as a top level term or upper group.
		 * @see DataStructure::deleteTerm
		 * 
		 * @param {Term} targetTerm 
		 * @returns 
		 */
		removeTerm( targetTerm ){
			let self = this;

			let dlgButtons = new Array();
			let cancelBtn = {
				text: Liferay.Language.get('cancel'),
				click:function(){
					$(this).dialog('destroy');
				}
			}

			let deleteBtn = {
				text: Liferay.Language.get('delete'),
				click: function(){
					self.deleteTerm(targetTerm, true);
					self.render(SXConstants.FOR_PREVIEW);

					$(this).dialog('destroy');
				}
			}

			let moveUpBtn = {
				text: Liferay.Language.get('move-group-up'),
				click: function(){
					self.moveTermGroupUp( targetTerm );
					self.render(SXConstants.FOR_PREVIEW);

					$(this).dialog('destroy');
				}
			}

			let removeBtn = {
				text: Liferay.Language.get('remove'),
				click: function(){
					self.deleteTerm(targetTerm, false);
					self.render(SXConstants.FOR_PREVIEW);

					$(this).dialog('destroy');
				}
			}

			
			let msg = Liferay.Language.get('something-wrong-to-delete-a-term');
			if( targetTerm.isMemberOfGroup() && targetTerm.isGroupTerm() ){
				msg = Liferay.Language.get('if-delete-button-is-clicked-all-sub-terms-will-be-deleted-from-the-structure-if-remove-button-is-clicked-the-term-is-deleted-and-all-sub-terms-are-moved-up-to-the-parent-group');
				dlgButtons.push(deleteBtn, removeBtn, moveUpBtn);
			}
			else if( targetTerm.isMemberOfGroup() && !targetTerm.isGroupTerm() ){
				msg = Liferay.Language.get('the-term-is-a-member-of-a-group-please-push-delete-button-to-delete-from-the-structure-or-push-remove-button-to-remove-from-the-group');
				dlgButtons.push(deleteBtn, moveUpBtn);
			}
			else if( !targetTerm.isMemberOfGroup() && targetTerm.isGroupTerm() ){
				msg = Liferay.Language.get('the-term-is-a-group-if-you-push-delete-button-all-sub-terms-would-be-deleted-from-the-structure-if-remove-button-is-pushed-al-sub-terms-are-moved-up-as-top-level-terms');
				dlgButtons.push(deleteBtn, removeBtn);
			}
			else if( !targetTerm.isMemberOfGroup() && !targetTerm.isGroupTerm() ){
				msg = Liferay.Language.get('are-you-sure-to-delete-the-term-from-the-data-structure');
				dlgButtons.push(deleteBtn);
			}

			dlgButtons.push(cancelBtn);

			let dialogProperty = {
				autoOpen: true,
				title:'',
				modal: true,
				draggable: true,
				width: 400,
				highr: 200,
				buttons:dlgButtons
			};

			$('<div>').text(msg).dialog( dialogProperty );

		}

		removeActiveTerm( activeTerm ){
			this.terms.every((term)=>{
				term.removeActiveTerm( activeTerm );
			});
		}
		
		exist( termName ){
			let exist = false;
			
			this.terms.every( (term) => {
				if( term.termName === termName ){
					exist = true;
					return SXConstants.STOP_EVERY;
				}
				return SXConstants.CONTINUE_EVERY;
			});
			
			return exist;
		}
		
		countTerms(){
			return this.terms.length;
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

			console.log( 'Abstract Key Terms: ', abstractKeyTerms);
			return abstractKeyTerms;
		}

		countAbstractKeyTerms( abstractKey=true ){
			return this.getAbstractKeyTerms( abstractKey ).length;
		}

		getSearchableTerms( searchable=true ){
			let searchableTerms = this.terms.filter(
				term =>{
					let definedValue = term.searchable ? true : false;
					return definedValue === searchable;
				}
			);

			console.log( 'Searchable Terms: ', searchableTerms);
			return searchableTerms;
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

			console.log( 'Downloadable Terms: ', downloadableTerms);
			return downloadableTerms;
		}

		countDownloadableTerms( downloadable=true ){
			return this.getDownloadableTerms( downloadable ).length;
		}

		toFileContent(){
			let fileContent = {};

			this.terms.every( (term) => {
				if( term.value ){
					fileContent[term.termName] = term.value;
				}
				return SXConstants.CONTINUE_EVERY;
			});

			console.log('File Content: ', fileContent );

			return JSON.stringify( fileContent );
		}

		toFileContentLine( key, value ){
			let line = "";
			if( this.termDelimiterPosition == false ){
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
			console.log( 'lines: ', lines );
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
					case 'commentChar':
						self[key] = jsonObj[key];
						break;
					case 'tooltip':
						self.tooltip = new LocalizedObject( jsonObj.tooltip );
						break;
					case 'terms':
						jsonObj.terms.forEach( jsonTerm=>{
							self.addTerm( TermTypes.CREATE_TERM(jsonTerm), baseOrder );
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

			if( this.commentString ){
				json.commentString = this.commentString;
			}

			if( !this.tooltip.isEmpty() ){
				json.tooltip = this.tooltip.getLocalizedMap();
			}

			if( this.terms ){
				json.terms = this.terms.map(term=>{
					return term.toJSON();
				});
			}

			return json;
		}


		/********************************************************************
		 * APIs for Preview panel
		 ********************************************************************/

		activateDependentTerms( termId, optionValue, forWhat ){
			let term = this.getTerm( termId );

			let activeTerms = term.getOptionActiveTerms( optionValue );

			if( forWhat === SXConstants.FOR_PREVIEW ){
				term.dependentTerms.forEach((dependTerm)=>{
					if( activeTerms.includes(dependTerm) ){
						$('tr.'+NAMESPACE+termName).removeClass('hide');
					}
					else{
						$('tr.'+NAMESPACE+termName).addClass('hide');
					}
				});
			}
			else if( forWhat === SXConstants.FOR_EDITOR ){
				// render for editor
			}
			else{
				// render for PDF
			}
		}

		highlightTerm( term, exclusive=true ){
			if( exclusive === true ){
				this.clearHighlight();
			}

			if( term && term.$rendered ){
				term.$rendered.addClass('highlight-border');
				return true;
			}

			return false;
		}

		clearHighlight(){
			this.terms.forEach(term=>{
				if( term.$rendered ){
					term.$rendered.removeClass('highlight-border');
				}
			});
		}

		clearTermsDirty(){
			this.terms.forEach(term=>{
				term.clearDirty();
			});
		}

		setTermsDirty( dirty=true ){
			this.terms.forEach(term=>{
				term.setDirty( dirty );
			});
		}

		devideTermsByGroup( groupTermId ){
			let devided = new Object();
			devided.hits = new Array();
			devided.others = new Array();

			this.terms.forEach(term=>{
				if( groupTermId.sameWith(term.getGroupId()) ){
					devided.hits.push( term );
				}
				else{
					devided.others.push( term );
				}
			});

			return devided;
		}

		/**
		 * Render term and attach a panel. If the term is a top level member
		 * it is appended to the data structure's preview panel, otherwise,
		 * it is appended to it's group's panel.
		 * 
		 * This function rerenders even if the previous rendered image already exist.
		 * 
		 * @param {Term} term
		 * @param {JqueryNode} $canvas 
		 * @param {int} forWhat 
		 * @param {boolean} highlight 
		 */
		renderTerm( term, forWhat=SXConstants.FOR_EDITOR, highlight=false ){
			let $panel = null;

			if( term.isMemberOfGroup() ){
				let group = this.getTerm(term.groupTermId);
				$panel = group.$getGroupPanel();
			}
			else {
				$panel = this.$canvas;
			}

			let $row = this.$renderTerm( term, forWhat );

			let rowCount = this.countPreviewRows( $panel );

			if( term.order > rowCount ){
				$panel.append( $row );
			}
			else if( term.order === 1 ){
				$panel.prepend( $row );
			}
			else{
				$panel.children('tr:nth-child('+term.order+')').before($row);
			}

			if( highlight === true ){
				this.highlightTerm( term );
			}
		}

		countPreviewRows( $panel ){
			return $panel.children('tr').length;
		}

		countGroupMembers( group=null ){
			return this.getGroupMembers( group ).length;
		}

		$renderTermEditor(){
			return null;
		}
		
		/**
		 * Render all of terms in the term list 
		 * no matter what those terms alredy have render images
		 * 
		 * @param { Integer } forWhat
		 * 		Rendering mode one of FOR_PREVIEW, FOR_EDITOR, FOR_PRINT
		 */
		render( forWhat=SXConstants.FOR_PREVIEW, $canvas ){
			$canvas = this.$setCanvas( forWhat, $canvas );

			let topLevelTerms = this.getGroupMembers( this.getTopLevelTermId() );
			
			$canvas.empty();
			
			//render from top level terms
			let self = this;
			topLevelTerms.forEach((term)=>{
				self.renderTerm(term, forWhat);
			});
		}

		$setCanvas( forWhat, $canvas ){
			if( $canvas ){
				this.forWhat = forWhat;
				this.$canvas = $canvas;
			}
			else{
				if( forWhat === SXConstants.FOR_PREVIEW ){
					this.$canvas = DataStructure.$DEFAULT_PREVIEW_PANEL;
				}
				else if( forWhat === SXConstants.FOR_EDITOR ){
					this.$canvas = DataStructure.$DEFAULT_CANVAS;
				}
				else if( forWhat === SXConstants.FOR_SEARCH ){
					this.$canvas = DataStructure.$DEFAULT_SEARCH_CANVAS
				}
				else{
					// for PDF
				}
			}

			return this.$canvas;
		}

		$getCanvas(){
			return this.$canvas;
		}

		insertPreviewRow( $row, index, $panel=DataStructure.$DEFAULT_PREVIEW_PANEL ){
			if( $panel.children( ':nth-child('+index+')' ).length === 0 ){
				$panel.append($row);
			}
			else{
				$panel.children( ':nth-child('+index+')' ).before( $row );
			}
		}

		$renderTerm( term, forWhat=SXConstants.FOR_PREVIEW ){
			if( term.isGroupTerm() ){
				let termSets = this.devideTermsByGroup( term.getTermId() );

				return term.$render( termSets.hits, termSets.others, forWhat );
			}
			else{
				return term.$render(forWhat);
			}
		}
		
		/**
		 * Refresh term's render image on the preview panel.
		 * 
		 * @param {Term} targetTerm 
		 */
		refreshTerm( targetTerm, forWhat=SXConstants.FOR_PREVIEW, deep=true ){
			if( !targetTerm.isRendered() ){
				return null;
			}
			
			let $canvas = null;
			if( targetTerm.isMemberOfGroup() ){
				let group = this.getTerm(targetTerm.groupTermId);
				$canvas = group.$groupPanel;
			}
			else{ // It means the target term is a top level.
				$canvas = this.$canvas;
			}

			targetTerm.$rendered.remove();

			this.renderTerm( targetTerm, forWhat, true );
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
							'en_US': '19세 이상 성인',
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
								activeTerms:[]
							},
							{
								labelMap:{
									'en_US': 'Under 18',
									'ko_KR': '18세 미만'
								},
								value:false,
								activeTerms:[]
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
							'en_US': '생년월일',
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

			this.parse( dataStructure, this.terms ? this.terms.length : 0 );
			
			this.setTermsDirty( false );
			let devided = this.devideTermsByGroup( this.getTopLevelTermId() );
			this.sortTermsByOrder( devided.hits, devided.others );
			this.terms = devided.hits.concat(devided.others);
			this.render( SXConstants.FOR_PREVIEW, $canvas );

			let firstTerm = this.terms[0];

			const eventData = {
				sxeventData:{
					sourcePortlet: NAMESPACE,
					targetPortlet: NAMESPACE,
					term: firstTerm
				}
			};
			
			Liferay.fire( SXIcecapEvents.DATATYPE_PREVIEW_TERM_SELECTED, eventData );
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
    	newDataStructure: function ( jsonStructure, forWhat, $canvas ){
    		let dataStructure = new DataStructure( jsonStructure );
			dataStructure.$setCanvas(forWhat, $canvas);

			return dataStructure;
		},
    	SXIcecapEvents: SXIcecapEvents,
		SXConstants: SXConstants, 
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
	    		case TermTypes.ARRAY:
	    			return new ArrayTerm();
	    		case TermTypes.MATRIX:
	    			return new MatrixTerm();
	    		case TermTypes.OBJECT:
	    			return new ObjectTerm();
	    		case TermTypes.OBJECT_ARRAY:
	    			return new ObjectArrayTerm();
	    		case TermTypes.PHONE:
	    			return new PhoneTerm();
	    		case TermTypes.DATE:
	    			return new DateTerm();
	    		case TermTypes.FILE:
	    			return new FileTerm();
	    		case TermTypes.FILE_ARRAY:
	    			return new FileArrayTerm();
	    		case TermTypes.DATA_LINK:
	    			return new DataLinkTerm();
	    		case TermTypes.DATA_LINK_ARRAY:
	    			return new DataLinkArrayTerm();
	    		case TermTypes.COMMENT:
	    			return new CommentTerm();
	    		case TermTypes.GROUP:
	    			return new GroupTerm();
	    		default:
	    			return null;
    		}
    	},
    	StringTerm: StringTerm,
    	NumericTerm: NumericTerm,
		ListTerm: ListTerm,
		BooleanTerm: BooleanTerm,
		GroupTerm: GroupTerm,
		FileTerm: FileTerm,
		DateTerm: DateTerm,
		FormUIUtil: FormUIUtil,
    	Util: Util,
		createVisualizer: function(){
			return new StationX.Visualizer();
		}
    };

	class SXWorkbench {
		constructor(){

		}

		
	}
}


