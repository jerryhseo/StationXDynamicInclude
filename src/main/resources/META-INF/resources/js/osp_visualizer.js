(function(OSP, $){
    'use strict';

    if( OSP.Visualizer ){
        console.log( 'OSP.Visualizer already loaded.');
        return;
    }

    OSP.Visualizer = function( config ){
        console.log( 'config: ', config );
        var portletId = config.portletId;
        var namespace  = config.namespace;
        var resourceURL = config.resourceURL;
        var connector = config.connector;
        var eventHandlers = config.eventHandlers;

        var loadCanvasFunc = config.loadCanvas;
        var canvas = config.displayCanvas;
        var menuOptions = config.menuOptions;
        var disabled = config.disabled;
        var initData;

        var currentData;
        var baseFolder;
        var procFuncs = {};

        var attachedEventHandlers = {};
        var fileExplorerId;
        var fileExplorerDialog;
        var dirDirty = false;

        var getPortletSection = function(){
            var portlet = $('#p_p_id'+namespace);
            if( !portlet[0] ){
                portlet = $('#'+namespace).parent();
            }

            //portlet = $('#workbench-layout-area');
            return portlet;
        };

        var blockVisualizer = function(){
            var portlet = getPortletSection();

            if( !portlet[0] ){
                console.log( 'There is no portlet section for '+namespace);
                return;
            }

            console.log( 'blockVisualizer portlets: ', portlet)
            var offset = portlet.offset();
            console.log('Block visualizer: '+namespace, offset, portlet.width(), portlet.height() );
            portlet.addClass("loading-animation loading-custom");
//            portlet.block({
//                        message:'<img src=\"'+Liferay.ThemeDisplay.getPathThemeImages()+'/custom/loading.gif\" style=\"position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:9990;\"/>',
//                        css: {
//                            'width':portlet.width()+'px',
//                            'height':portlet.height()+'px',
//                            'margin': '0px 0px 0px 0px',
//                            'showOverlay': false
//                        }
//                    });
        };

        var unblockVisualizer = function(){
            console.log('Unblock visualizer: '+namespace);
            var portlet = getPortletSection();
            if( !portlet[0] ){
                return;
            }
            portlet.removeClass("loading-animation loading-custom");
//            portlet.unblock();
        };

        var showAlert = function( msg ){
            var dialog = $('<div></div>');
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
        };
        
        var createFormData = function( jsonData ){
            var formData = new FormData();
            for( var key in jsonData ){
                formData.append( namespace+key, jsonData[key] );
            }

            return formData;
        };
        // Open MyDrive Modal
        var openServerFileExplorer = function( procFuncName, changeAlert ){
        	AUI().use("liferay-portlet-url", function(a){
        		// set portlet & popup properties
        		var portletURL = Liferay.PortletURL.createRenderURL();
        		portletURL.setPortletMode("view");
        		portletURL.setWindowState("pop_up");
        		portletURL.setPortletId("OSPIcecle_web_icecle_personal_OSPDrivePortlet");
        		
        		// set parameters to portletURL
        		portletURL.setParameter('connector', portletId);
        		portletURL.setParameter('disabled', false);
                portletURL.setParameter('repositoryType',currentData.repositoryType());
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
        		var contentWindow = Liferay.Util.getWindow("myDriveDialogModal").iframe.node._node.contentWindow;
        		var selectedLi = $(contentWindow.document).find(contentWindow.DRIVE_LIST_BODY + " li.ui-selected");
        		if(selectedLi.length > 0){
        			var selectedFilePath = $(selectedLi).data('resourcePath');
        			var fileInfoStr = selectedFilePath.split("\\");
        			
        			var fileInfoObj = {};
        			fileInfoObj.type_ = OSP.Enumeration.PathType.FILE;
        			var parentStr = "";
        			fileInfoStr.forEach(function(eachStr, i){
        				if( i < fileInfoStr.length -1 ){
        					parentStr += eachStr+"/";
        				}else{
        					fileInfoObj.name_ = eachStr;
        				}
        			});
        			fileInfoObj.repositoryType_ = 'USER_DRIVE';
        			fileInfoObj.parent_ = parentStr;
        			loadCanvas( fileInfoObj, changeAlert );
        			Liferay.Util.getWindow("myDriveDialogModal").destroy();
        		}else{
        			toastr.error('Please select file.', {timeout:3000});
        			return false;
        		}
        	},['liferay-util-window']);
        };

        var readServerFile = function( jsonData, changeAlert ){
            if( jsonData ){
                setCurrentData( jsonData );
            }
            var params = {
                command:'READ_FILE',
                repositoryType: baseFolder.repositoryType(),
                userScreenName: currentData.user(),
                dataType: currentData.dataType(),
                pathType: currentData.type(),
                parentPath: currentData.parent(),
                fileName: currentData.name()
            };
            var formData = createFormData( params );

            $.ajax({
                url : resourceURL,
                type : 'POST',
                data : formData,
                dataType:'text',
                global : false,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: blockVisualizer,
                success : function(data) {
                    // console.log( 'currentData after readFile: ', currentData );
                        var result = {
                            type_: OSP.Enumeration.PathType.FILE_CONTENT,
                            content_: data
                        };
                        loadCanvas( result, changeAlert );
                },
                error: function(data, e ){
                    console.log('Error read server file: ', jsonData, data, e);
                },
                complete: unblockVisualizer
            });
        };

        var readServerFileURL = function( jsonData, changeAlert ){
        	if( jsonData ){
                setCurrentData( jsonData );
            }
            createURL('READ_FILE', changeAlert);
        };

        var readDataTypeStructure = function( name, version, changeAlert ){
            var params = {
                command: 'READ_DATATYPE_STRUCTURE',
                dataTypeName: name,
                dataTypeVersion: version
            };

            var formData = createFormData( params );

            $.ajax({
                url : resourceURL,
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
                        var result = {
                            type_: OSP.Enumeration.PathType.STRUCTURED_DATA,
                            dataType_:{
                                name: data.dataTypeName,
                                version:data.dataTypeVersion
                            },
                            content_:JSON.parse( data.structuredData )
                        };
                        setCurrentData( result );

                        loadCanvas( OSP.Util.toJSON(currentData, changeAlert) );
                },
                error: function(data, e ){
                    console.log('Error read first server file name: ', jsonData, data, e);
                },
                complete: unblockVisualizer
            });
        };

        var getFirstFileName = function( successFunc ){
            var params = {
                command:'GET_FIRST_FILE_NAME',
                repositoryType: baseFolder.repositoryType(),
                userScreenName: currentData.user(),
                dataType: currentData.dataType(),
                pathType: baseFolder.type(),
                parentPath: currentData.parent()
            };

            OSP.Debug.eventTrace('getFirstFileName()', 'Params', params);

            if( baseFolder.type() === OSP.Enumeration.PathType.EXT){
                params.fileName = baseFolder.name();
            }
             var formData = createFormData( params );

             $.ajax({
                url : resourceURL,
                type : 'POST',
                data : formData,
                dataType:'json',
                global : false,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: blockVisualizer,
                success : function(data) {
                       console.log( 'currentData after readFile: ', data );
                       if( data.result === 'no-file' ){
                           return;
                       }

                        var result = {
                            type_: OSP.Enumeration.PathType.FILE,
                            parent_: data.parentPath,
                            name_:data.fileName
                        };
                        OSP.Debug.eventTrace('result of getFirstFileName', data, result);
                        setCurrentData( result );

                        successFunc();
                        //loadCanvas( OSP.Util.toJSON(currentData), false);
                },
                error: function(data, e ){
                    console.log('Error read first server file name ( function name : getFirstFileName ) : ', data, e);
                },
                complete: unblockVisualizer
            });
        };

        var readFirstServerFile = function( jsonData, changeAlert ){
            if( jsonData ){
                setCurrentData( jsonData );
            }

            var successFunc = function(){
                loadCanvas( OSP.Util.toJSON(currentData), changeAlert );
            };

            getFirstFileName( successFunc );
        };

        var readFirstServerFileURL = function( jsonData, changeAlert ){
            if( jsonData ){
                 setCurrentData( jsonData );
            }

             var successFunc = function(){
                createURL('READ_FILE', changeAlert);
            };

            getFirstFileName( successFunc, changeAlert );
        };

        var refreshFileExplorer = function(){
            if( !dirDirty ){
                return;
            }

            var eventData = {
                        portletId: portletId,
                        targetPortlet: fileExplorerId,
                        data: {
                                repositoryType_: baseFolder.type(),
                                user_: currentData.user(),
                                type_: OSP.Enumeration.PathType.FILE,
                                parent_: currentData.parent(),
                                name_: currentData.name()
                        },
                        params:{
                            changeAlert:false
                        }
            };
            Liferay.fire(OSP.Event.OSP_LOAD_DATA, eventData );

            dirDirty = false;
        };

        var refresh = function(){
            Liferay.Portlet.refresh('#p_p_id'+namespace);
        };

        var saveAtServerAs = function( folderPath, fileName, content ){
            var saveData = {
                command: 'SAVE',
                repositoryType: baseFolder.repositoryType(),
                userScreenName: currentData.user(),
                dataType: currentData.dataType(),
                pathType: currentData.type(),
                parentPath: folderPath,
                fileName: fileName,
                content: content
            };
            var formData = createFormData( saveData );

             $.ajax({
                url : resourceURL,
                type : 'POST',
                data : formData,
                dataType:'text',
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                global : false,
                beforeSend: blockVisualizer,
                success : function(data) {
                        currentData.parent( folderPath );
                        currentData.name(fileName);
                        currentData.content(content);
                        currentData.dirty( false );
                        dirDirty = true;
                },
                error: function(data, e ){
                    console.log('Error read file: ', data, e);
                },
                complete: unblockVisualizer
            });
        };

        var setCurrentData = function( jsonData ){
            if( jsonData ){
                currentData.deserialize( jsonData );
                if( currentData.type() === OSP.Enumeration.PathType.FOLDER &&
                    baseFolder.type() === OSP.Enumeration.PathType.EXT ){
                    currentData.type( baseFolder.type() );
                    currentData.name( baseFolder.name() );
                }
            }
        };

        var runProcFuncs = function( funcName ){
            var args = Array.prototype.slice.call(arguments);
            var newArgs = [];
            var funcName = args[0];
            for (var i = 1; i < args.length; i++) {
                newArgs.push(args[i]);
            }

            var funcs = procFuncs[funcName];
            if( !funcs ){
                console.log('Proc Functions not exist: '+ funcName, procFuncs );
                return;
            } 
            // run all functions name by funcName
            //console.log( 'funcs: ', funcs );
            funcs.forEach(function( func){
                func.apply(null, newArgs);
            });
        };

        var callIframeFunc = function(funcName, resultProcFunc ){
            var args = Array.prototype.slice.call(arguments);
            var stripedArgs = [];
            for (var i = 2; i < args.length; i++) {
                stripedArgs.push(args[i]);
            }
            var result = canvas.contentWindow[funcName].apply(canvas.contentWindow, stripedArgs);
            if( resultProcFunc ){
                resultProcFunc( result );
            }
        };

        var readDLFileEntry = function(changeAlert){
            var params = {
                command:'READ_DLENTRY',
                dlEntryId: currentData.content()
            };

            var formData = createFormData( params );
            
            $.ajax({
                url : resourceURL,
                type : 'POST',
                data : formData,
                dataType:'json',
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: blockVisualizer,
                success : function(result) {
                    var jsonData = {
                        type_: OSP.Enumeration.PathType.CONTENT,
                        content_: result
                    };
                    setCurrentData( jsonData );
                    loadCanvas( OSP.Util.toJSON(currentData), changeAlert );
                },
                error: function(data, e ){
                    errorFunc(data, e);
                },
                complete: unblockVisualizer
            });
        };

        var readDLFileEntryURL = function(changeAlert){
            createURL('READ_DLENTRY', changeAlert);
        };
        
        var deleteFile = function ( fileName, parentPath, successFunc ){
        	var params = {
                command: 'DELETE',
                repositoryType: baseFolder.repositoryType(),
                parentPath: parentPath,
                fileName: fileName
            };
            var formData = createFormData( params );
            $.ajax({
                url : resourceURL,
                type : 'POST',
                data : formData,
                dataType:'json',
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: blockVisualizer,
                success : function(data) {
                        //currentData.deserialize( data );
                        currentData.type( OSP.Enumeration.PathType.FILE );
                        successFunc(data);
                },
                complete: unblockVisualizer
            });
        }
        
        var submitUpload = function( localFile, successFunc ){
            var params = {
                command: 'UPLOAD',
                uploadFile: localFile,
                repositoryType: baseFolder.repositoryType(),
                parentPath: currentData.parent(),
                fileName: currentData.name()
            };
            var formData = createFormData( params );
            $.ajax({
                url : resourceURL,
                type : 'POST',
                data : formData,
                dataType:'json',
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: blockVisualizer,
                success : function(data) {
                        //currentData.deserialize( data );
                        currentData.type( OSP.Enumeration.PathType.FILE );
                        successFunc(data);
                },
                complete: unblockVisualizer
            });
        };
        
        var showFileUploadConfirmDialog = function( localFile, targetFileName, successFunc){
            var dialogDom = 
                    '<div id="' + namespace + 'confirmDialog">' +
                        '<input type="text" id="' + namespace + 'targetFilePath" class="form-control"/><br/>' +
                        '<p id="' + namespace + 'confirmMessage">' +
                        'File already exists. Change file name or just click "OK" button to overlap.' +
                        '</p>' +
                    '</div>';
            var dialog = $(dialogDom);
            dialog.find( '#'+namespace+'targetFilePath').val(OSP.Util.mergePath(currentData.parent(), targetFileName));
            dialog.dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    'OK': function(){
                        var targetPath = dialog.find( '#'+namespace+'targetFilePath').val();
                        var path = OSP.Util.convertToPath( targetPath );
                        currentData.parent(path.parent_);
                        currentData.name(path.name_);
                        submitUpload( localFile, successFunc );
                        dialog.dialog( 'destroy' );
                    },
                    'Cancel': function() {
                        dialog.dialog( 'destroy' );
                    }
                }
            });
        };
        
        var uploadFile = function( localFile, targetFileName, successFunc ){
            var formData = new FormData();
            formData.append(namespace+'command', 'CHECK_DUPLICATED');
            formData.append(namespace+'repositoryType', baseFolder.repositoryType());
            formData.append(namespace+'userScreenName', currentData.user());
            formData.append(namespace+'target', OSP.Util.mergePath(currentData.parent(), targetFileName));
            
            $.ajax({
                    url: resourceURL,
                    type: 'POST',
                    dataType: 'json',
                    data:formData,
                    processData: false,
                    contentType: false,
                    beforeSend: blockVisualizer,
                    success: function( result ){
                        if( result.duplicated ){
                            showFileUploadConfirmDialog( localFile, targetFileName, successFunc );
                        }
                        else{
                            currentData.name( targetFileName );
                            submitUpload( localFile, successFunc);
                        }
                    },
                    error: function( data, e ){
                        console.log( 'checkDuplicated error: ', data, e);
                    },
                    complete: unblockVisualizer
            });
        };

        var createURL = function( command, changeAlert ){
            AUI().use('liferay-portlet-url', function(A) {
                var serveResourceURL;
                serveResourceURL = Liferay.PortletURL.createResourceURL();
                serveResourceURL.setPortletId(portletId);
                serveResourceURL.setParameter('repositoryType', currentData.repositoryType());
                serveResourceURL.setParameter('userScreenName', currentData.user());
                serveResourceURL.setParameter('parentPath', currentData.parent());
                serveResourceURL.setParameter('pathType', currentData.type());
                serveResourceURL.setParameter('fileName', currentData.name());
                serveResourceURL.setParameter('command', command);

                var jsonData = {
                    type_: OSP.Enumeration.PathType.URL,
                    content_: serveResourceURL.toString()
                };

                setCurrentData( jsonData );
                loadCanvas( OSP.Util.toJSON(currentData), changeAlert);
            });
        };

        var downloadFiles = function ( fileNames ){
            if( fileNames.length < 1 ){
                showAlert('Must select one or more files to download!' ); 
                return;
            }
//            window.location.href = createURL('DOWNLOAD');
            var separator = (resourceURL.indexOf('?') > -1) ? '&' : '?';
            var data = {};
            data[namespace+'command'] = 'DOWNLOAD';
            data[namespace+'repositoryType'] = baseFolder.repositoryType();
            data[namespace+'userScreenName'] = currentData.user();
            data[namespace+'parentPath'] = currentData.parent();
            data[namespace+'fileNames'] = JSON.stringify(fileNames);

            var url = resourceURL + separator + $.param(data);
            
            window.location.href = url;
        };

        var attachEventHandler = function( event, handler ){
            if( attachedEventHandlers[event] ){
                Liferay.detach( event, attachedEventHandlers[event] );
            }
            else{
                attachedEventHandlers[event] = function( e ){
                	if( e.targetPortlet !== portletId ) return;
            		if(event == OSP.Event.OSP_CHECK_MANDATORY){
                    	var isPassed = handler( e.data, e.params );
                    	return isPassed;
                    }else{
                    	handler( e.data, e.params );
                    }
                };
            }
            Liferay.on( event, attachedEventHandlers[event] );
        };
        

        var setBaseFolderAndCurrentData = function(){
            currentData = new OSP.InputData( initData );
            currentData.dirty(false);
            baseFolder = new OSP.InputData();

            for( var key in initData ){
                switch( key ){
                    case OSP.Constants.TYPE:
                        if( initData[key] !== OSP.Enumeration.PathType.FOLDER && 
                             initData[key] !== OSP.Enumeration.PathType.EXT ){
                            baseFolder.type( OSP.Enumeration.PathType.FOLDER );
                        }
                        else{
                            baseFolder.type( initData[key] );
                        }
                        break;
                    default:
                        baseFolder[key] = initData[key];
                        break;
                }
            }

            if( !baseFolder.repositoryType() ){
                console.log('[WARNING] Portlet '+portletId+' baseFolder has no repositoryType!');
            }

        };

        var attachEventHandlers = function(){
           // console.log( 'Event Handlers: ', eventHandlers);
            for( var event in eventHandlers){
            	var handler = eventHandlers[event];
                attachEventHandler( event, handler);
            }

            var defaultHandshakeEventHandler = function( data, params ){
                //connector, disabled, and Base folder information
               connector = config.connector = params.connector;
               disabled = params.disabled;

                processInitAction(data, false);
                // console.log('baseFolder: ', baseFolder );
                
                var eventData = {
                            portletId: portletId,
                            targetPortlet: params.connector,
                            data: [],
                            params: params
                };

                Liferay.fire( OSP.Event.OSP_REGISTER_EVENTS, eventData );
            };

            var defaultEventsResigeteredEventHandler = function( jsonData, params ){
            }; 

            var defaultDisableControlsEventHandler = function( data, params ){
                disabled = data;
                if( canvas.tagName.toLowerCase() === 'iframe' && canvas.contentWindow['disable']){
                     canvas.contentWindow['disable']( disabled );
                }
            };
            
            var defaultCheckMandatoryEventHandler = function(){
            	var eventData = {
                            targetPortlet : portletId
                };
                Liferay.fire( OSP.Event.OSP_CHECK_MANDATORY , eventData );
            }
            
            if( ! eventHandlers.hasOwnProperty( OSP.Event.OSP_HANDSHAKE ) ){
                attachEventHandler( OSP.Event.OSP_HANDSHAKE, defaultHandshakeEventHandler );
            }
            if( ! eventHandlers.hasOwnProperty( OSP.Event.OSP_EVENTS_REGISTERED ) ){
                attachEventHandler(  OSP.Event.OSP_EVENTS_REGISTERED, defaultEventsResigeteredEventHandler );
            }
            if( ! eventHandlers.hasOwnProperty( OSP.Event.OSP_DISABLE_CONTROLS ) ){
                attachEventHandler(  OSP.Event.OSP_DISABLE_CONTROLS, defaultDisableControlsEventHandler );
            }
            if( ! eventHandlers.hasOwnProperty( OSP.Event.OSP_CHECK_MANDATORY ) ){
            	attachEventHandler( OSP.Event.OSP_CHECK_MANDATORY, defaultCheckMandatoryEventHandler);
            }
        };

        var createEventData = function( data, params ){
            return {
                portletId: portletId,
                targetPortlet: connector,
                data: data ? data : undefined,
                params: params ? params : undefined
            };
        };
        var fireRegisterEventsEvent = function( data, params ){
            // console.log( '++++ EventData: ', createEventData(data, params ));
            Liferay.fire( OSP.Event.OSP_REGISTER_EVENTS, createEventData(data, params ));
        };
        var fireDataChangedEvent = function( data, params ){
            if( data ){
            	if(!data.type_){
            		if(currentData.type()===OSP.Enumeration.PathType.FILE_CONTENT){
            			data.type_ = currentData.type();
            		}
            	}
            	
                setCurrentData( data );
                currentData.dirty(true);
            }
            // console.log('Fire data changed event: ', currentData );
            var eventData = data ? data : OSP.Util.toJSON(currentData);

            checkInputPortsType(eventData);
            
            Liferay.fire( OSP.Event.OSP_DATA_CHANGED, createEventData(eventData, params ) );
        };
        
        /* Strucutred Data's Port type check */
        var checkInputPortsType = function(data) {
        	var inputsType = data[OSP.Constants.TYPE];
        	if(inputsType === OSP.Enumeration.PathType.FILE_CONTENTS) {
        		var fileContents = data[OSP.Constants.CONTENT];
        		if( fileContents.fileCount === 1 ) {
        			data[OSP.Constants.TYPE] = OSP.Enumeration.PathType.FILE_CONTENT
        			data[OSP.Constants.CONTENT] = ( fileContents.content[0].join('') );
        		}
        	}
        }

        var fireSampleSelectedEvent = function( data, params ){
            Liferay.fire( OSP.Event.OSP_SAMPLE_SELECTED, createEventData(data, params) );
        };

        var fireRequestSampleContentEvent = function( data, params ){
            console.log("sampleFileRead")
            console.log(createEventData(data, params))
        	Liferay.fire( OSP.Event.OSP_REQUEST_SAMPLE_CONTENT, createEventData(data, params) );
        };

        var fireRequestSampleURL = function( data, params){
             Liferay.fire( OSP.Event.OSP_REQUEST_SAMPLE_URL, createEventData(data, params) );
        };

        var fireRequestDataEvent = function ( targetPortlet, data, params ){
            var eventData = {
                portletId: portletId,
                targetPortlet: targetPortlet,
                data: data,
                params: params
            };
            Liferay.fire( OSP.Event.OSP_REQUEST_DATA, eventData );
        };

        var fireResponseDataEvent = function( jsonData, params ){
            console.log('Fire response data event: ', jsonData, params );
            /*
            if( jsonData)
                currentData.deserialize( jsonData );
            */
            
            Liferay.fire( OSP.Event.OSP_RESPONSE_DATA, createEventData( jsonData, params ) );
        };

        var openHtmlIndex = function( jsonData, changeAlert ){
            console.log('openHtmlIndex: ', jsonData, changeAlert);
            if( jsonData ){
                setCurrentData( jsonData );
            }

            var params = {
                command: 'READ_HTML_INDEX_URL',
                repositoryType: baseFolder.repositoryType(),
                userScreenName: currentData.user(),
                pathType: OSP.Enumeration.PathType.FILE,
                parentPath: currentData.parent(),
                fileName: currentData.name()
            };

            var formData = createFormData( params );

            $.ajax({
                type: 'POST',
                url: resourceURL, 
                data  : formData,
                dataType : 'json',
                processData: false,
                contentType: false,
                beforeSend: blockVisualizer,
                success: function(result) {
                    var jsonData = {
                        type_: OSP.Enumeration.PathType.URL,
                        content_:  OSP.Util.mergePath( result.parentPath, result.fileName),
                        fileType_: result.fileType
                    };
                    loadCanvas( jsonData, changeAlert );
                    //successFunc( data.parentPath, data.fileInfos );
                },
                error:function(ed, e){
                    console.log('Cannot openHtmlIndex', params, ed, e);
                },
                complete: unblockVisualizer
            }); 
        };

        var getCopiedTempFilePath = function(contextPath, jsonData, changeAlert){
            if( jsonData ){
                setCurrentData( jsonData );
            }

            var params = {
                command: 'GET_COPIED_TEMP_FILE_PATH',
                repositoryType: baseFolder.repositoryType(),
                userScreenName: currentData.user(),
                pathType: currentData.type(),
                parentPath: currentData.parent(),
                fileName: currentData.name()
            };

            var formData = createFormData( params );

            $.ajax({
                type: 'POST',
                url: resourceURL, 
                data  : formData,
                dataType : 'json',
                processData: false,
                contentType: false,
                beforeSend: blockVisualizer,
                success: function(result) {
                    var jsonData = {
                        type_: OSP.Enumeration.PathType.URL,
                        content_: contextPath+'/'+OSP.Util.mergePath( result.parentPath, result.fileName ),
                        fileType_: result.fileType
                    };
                    loadCanvas( jsonData, changeAlert );
                    //successFunc( data.parentPath, data.fileInfos );
                },
                error:function(ed, e){
                    console.log('Cannot openHtmlIndex', params, ed, e);
                },
                complete: unblockVisualizer
            }); 
        };

        var openLocalFile = function( contentType, changeAlert ){
            console.log('Open Local File');
            var domFileSelector = $('<input type=\"file\" id=\"'+namespace+'selectFile\"/>');
            domFileSelector.click();
            domFileSelector.on(
                'change',
                function(event){
                    var reader = new FileReader();
                    var fileName = '';
                    
                    fileName = OSP.Util.getLocalFileName(this);
                    var file = OSP.Util.getLocalFile( this );
                    switch( contentType ){
                        case 'url':
                            reader.readAsDataURL(file);
                            break;
                        default:
                            reader.readAsText(file);
                            break;
                    }
                    reader.onload = function (evt) {
                        var result = {};
                        switch(contentType){
                            case 'url':
                                result.type_ = OSP.Enumeration.PathType.URL;
                                break;
                            default:
                                result.type_ = OSP.Enumeration.PathType.CONTENT;
                                break;
                        }
                        result.name_ = fileName;
                        result.content_ = evt.target.result;
                        loadCanvas(result, changeAlert);
                    };
                }
            );
        };

        var saveAtServer = function(content){
            switch( currentData.type() ){
                case OSP.Enumeration.PathType.FILE_CONTENT:
                case OSP.Enumeration.PathType.FILE:
                    saveAtServerAs( currentData.parent(), currentData.name(), content );
                    break;
                default:
                    openServerFileExplorer('saveAtServerAs');
                    break;
            }
        };

        var saveAtLocal = function( content, contentType ){
            var a = document.createElement("a");

            if( !contentType ){
                contentType = 'text/pplain';
            }
            var file = new Blob([content], {type: contentType});
            a.href = URL.createObjectURL(file);
            a.download = currentData.name();
            a.click();
        };

        var uploadLocalFile = function( successFunc ){
            var domFileSelector = $('<input type=\"file\"/>');
            domFileSelector.click();
            domFileSelector.on(
                'change',
                function(event){
                    var localFile = OSP.Util.getLocalFile( this );
                    var defaultTargetFileName = OSP.Util.getLocalFileName( this );
                    uploadFile( localFile,  defaultTargetFileName, successFunc );
                }
            );
        };

        var getFolderInfo = function( folderPath, extension, changeAlert){
            var params = {};
            params.command = 'GET_FILE_INFO';
            params.repositoryType = baseFolder.repositoryType();
            params.userScreenName = currentData.user();
            params.parentPath = folderPath;

            if( baseFolder.type() === OSP.Enumeration.PathType.EXT ){
                params.pathType = OSP.Enumeration.PathType.EXT;
                params.fileName = extension;
            }
            else{
                params.pathType = OSP.Enumeration.PathType.FOLDER;
            }
            
            var formData = createFormData( params );

           $.ajax({
                type: 'POST',
                url: resourceURL, 
                data  : formData,
                dataType : 'json',
                processData: false,
                global : false,
                contentType: false,
//                beforeSend: blockVisualizer,
                success: function(data) {
                    var jsonData = {
                        type_: OSP.Enumeration.PathType.FOLDER_CONTENT,
                        parent_: data.parentPath,
                        name_: currentData.name(), 
                        content_: data.fileInfos
                    };
                    loadCanvas( jsonData, changeAlert );
                    //successFunc( data.parentPath, data.fileInfos );
                },
                error:function(ed, e){
                    console.log('Cannot lookup directory', params, ed, e);
                },
                complete: unblockVisualizer
            });
        };


        var loadCanvas = function( jsonData, changeAlert ){
            // console.log('loadCanvas data: ', jsonData, changeAlert );
        	setCurrentData( jsonData );
            loadCanvasFunc( OSP.Util.toJSON(currentData), changeAlert);
        };
        var downloadResultFile = function(){
        	var sendData = Liferay.Util.ns(namespace, {
        		parentPath : currentData.parent_,
        		fileName : currentData.name_,
        		repositoryType : "USER_JOBS",
        		command : "DOWNLOAD_WITH_IB"
        	});
        	
        	$.ajax({
        		url : resourceURL,
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
        var downloadCurrentFile = function( contextPath, requestType ){
        	var downloadType = requestType || currentData.type();
        	
            switch( downloadType ){
                case OSP.Enumeration.PathType.FILE:
                case OSP.Enumeration.PathType.FILE_CONTENT:
                    var fileNames = [currentData.name()];
                    downloadFiles( fileNames);
                    break;
                case OSP.Enumeration.PathType.CONTENT:
                	var downloadFileName = currentData.name() || 'textFile.txt'; 
                	
                	var textFileAsBlob = new Blob([currentData.content()], {type:'text/plain'}); 
                	var downloadLink = document.createElement("a");
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
                case OSP.Enumeration.PathType.URL:
                    if( contextPath ){
//                        window.location.href = contextPath+currentData.content();
                    }
                    else{
                    	var downloadContent = currentData.content();
                    	
                    	if(downloadContent.indexOf('data') == 0){
                        	var base64Code = downloadContent.substring(downloadContent.indexOf(',')+1);

                        	var preData = downloadContent.substring(0, downloadContent.indexOf(','));
                        	var contentType = preData.substring(preData.indexOf(':')+1, preData.indexOf(';'));
                        	/*
                        	 * base64Code -> Blob
                        	 */
                        	var byteCharacters = atob(base64Code);
                        	var byteArrays = [];
                        	for(var offset = 0 ; offset < byteCharacters.length ; offset += 512){
                        		var slice = byteCharacters.slice(offset, offset + 512);
                        		
                        		var byteNumbers = new Array(512);
                        		for(var i = 0 ; i < slice.length ; i++){
                        			byteNumbers[i] = slice.charCodeAt(i);
                        		}
                        		var byteArray = new Uint8Array(byteNumbers);
                        		byteArrays.push(byteArray);
                        	}
                        	
                        	var blob = new Blob(byteArrays, {type : contentType});
                        	if(window.navigator.msSaveOrOpenBlob){
                        		window.navigator.msSaveBlob(blob, currentData.name());
                        	}else{
                        		var aTag = window.document.createElement("a");
                        		
                        		aTag.href = window.URL.createObjectURL(blob, {
                        			type : contentType
                        		});
                        		aTag.download = currentData.name();
                        		document.body.appendChild(aTag);
                        		aTag.click();
                        		document.body.removeChild(aTag);
                        	}
                    	}else{
                    		var fileNames = [currentData.name()];
                            downloadFiles( fileNames);
                    	}
                    }
                    break;
            }
        };
        
        var openServerFile = function( procFuncName, changeAlert ){
                if( procFuncName )
                    openServerFileExplorer( procFuncName, changeAlert );
                else
                    openServerFileExplorer( 'readServerFile', changeAlert );
        };

        var processInitAction = function( jsonData, launchCanvas, changeAlert ){
        	if( jsonData ){
                initData = jsonData;
                initData.type_ = jsonData.type_ ? jsonData.type_ : OSP.Enumeration.PathType.FOLDER;
                initData.parent_ = jsonData.parent_ ? jsonData.parent_ : '';
                initData.name_ = jsonData.name_ ? jsonData.name_ : '';
            }
            
            setBaseFolderAndCurrentData();
            // console.log( 'After processInitAction: ', currentData );
            if( launchCanvas ){
                loadCanvas( OSP.Util.toJSON(currentData), changeAlert );
            }
        };

        //Add custom proc funcs
        for( var funcName in config.procFuncs ){
            var funcs;
            if( procFuncs.hasOwnProperty(funcName) ){
                funcs = procFuncs[funcName];
            }
            else{
                funcs = [];
                procFuncs[funcName] = funcs;
            }
            funcs.push( config.procFuncs[funcName] );
        }
           
        //Set currentData and baseFolder if initData exists
        if( !$.isEmptyObject(initData) ){
            setBaseFolderAndCurrentData();
        }

        //Hides un-needed menu
        if( !$.isEmptyObject(menuOptions ) ){
            if( menuOptions.menu === false )     $('#'+namespace+'menu').remove();
            if( menuOptions.sample === false )             $('#'+namespace+'sample').remove();
            if( menuOptions.upload === false )             $('#'+namespace+'upload').remove();
            if( menuOptions.download === false )        $('#'+namespace+'download').remove();
            if( menuOptions.openLocalFile === false )       $('#'+namespace+'openLocalFile').remove();
            if( menuOptions.openServerFile === false )      $('#'+namespace+'openServerFile').remove();
            if( menuOptions.saveAtLocal === false )     $('#'+namespace+'saveAtLocal').remove();
            if( menuOptions.saveAtServer === false ){
                    $('#'+namespace+'save').remove();
                    $('#'+namespace+'saveAs').remove();
            }
        }

        // Set namespace on iframe if canvas is iframe
        
        if( canvas.tagName.toLowerCase() === 'iframe' ){
            // console.log('Visualizer setNamespace!!');
        	if(canvas.contentWindow['setNamespace']){
        		canvas.contentWindow['setNamespace']( namespace );
        	}else{
        		setTimeout(function(){ 
        			canvas.contentWindow['setNamespace']( namespace );
        		}, 500)
        	}
        	
            if( disabled )
                canvas.contentWindow['disable']( disabled );
        }

        attachEventHandlers();

        //Attach default proc functions
        procFuncs.readServerFile = [
                readServerFile
        ];
        procFuncs.saveAtServerAs = [
                saveAtServerAs
        ];
        procFuncs.readServerFileURL = [
                readServerFileURL
        ];

        /**
         * The following block will be enabled after OSP_HANDSHAKE event is deprecated.  
         *  
        if( connector ){
            var events = [];
            for( var event in attachedEventHandlers ){
                events.push( event );
            }
            console.log('--------------------------', events);
            fireRegisterEventsEvent( events, {} );
        }
         */
        /*	SDE Mandatory Check Event	*/
        var fireMadatoryCheckEvent = function(){
        	var isPassed = Liferay.fire( OSP.Event.OSP_CHECK_MANDATORY, {targetPortlet : portletId});
        	return isPassed;
        }
        return {
            VERSION:'2019-3-15',
            callIframeFunc: callIframeFunc,
            configConnection: function( caller, disable ){
                connector = caller;
                disabled = disable;
            },
            disabled: function( disable ){
                disabled = disable;
            },
            downloadFiles: downloadFiles,
            downloadCurrentFile: downloadCurrentFile,
            downloadResultFile : downloadResultFile,
            fireDataChangedEvent: fireDataChangedEvent,
            fireSampleSelectedEvent: fireSampleSelectedEvent,
            fireRegisterEventsEvent: fireRegisterEventsEvent,
            fireRequestSampleContentEvent:fireRequestSampleContentEvent,
            fireRequestSampleURL:fireRequestSampleURL,
            fireRequestDataEvent: fireRequestDataEvent,
            fireResponseDataEvent:fireResponseDataEvent,
            fireMadatoryCheckEvent : fireMadatoryCheckEvent,
            getFolderInfo: getFolderInfo,
            createTempFilePath: function( contextPath, jsonData, changeAlert, linked ){
               if( linked ){
                   return getLinkedTempFilePath(contextPath, jsonData, changeAlert);
               }
               else{
                   return getCopiedTempFilePath(contextPath, jsonData, changeAlert);
               }
            },
            isDirty: function(){
                return currentData.dirty();
            },
            loadCanvas: loadCanvas,
            openHtmlIndex: openHtmlIndex,
            openLocalFile: openLocalFile,
            openLocalFileURL: function(changeAlert){
                openLocalFile('url', changeAlert);
            },
            openServerFile: openServerFile,
            openServerFileURL: function(changeAlert){
                openServerFile( 'readServerFileURL', changeAlert);
            },
            processInitAction: processInitAction,
            readDataTypeStructure:readDataTypeStructure,
            readDLFileEntry: readDLFileEntry,
            readDLFileEntryURL: readDLFileEntryURL,
            readFirstServerFile: readFirstServerFile,
            readFirstServerFileURL:readFirstServerFileURL,
            readServerFile: readServerFile,
            readServerFileURL: readServerFileURL,
            refresh: refresh,
            runProcFuncs: runProcFuncs,
            saveAtLocal: saveAtLocal,
            saveAtServer: saveAtServer,
            saveAtServerAs: function( content ){
                if( content ){
                    var jsonData = {
                        type_: OSP.Enumeration.PathType.FILE_CONTENT,
                        content_: content
                    };

                    setCurrentData( jsonData );
                }
                
                openServerFileExplorer('saveAtServerAs');
            },
            showAlert: showAlert,
            uploadLocalFile: uploadLocalFile,
            deleteFile : deleteFile
        };
    };
})(OSP, jQuery);
