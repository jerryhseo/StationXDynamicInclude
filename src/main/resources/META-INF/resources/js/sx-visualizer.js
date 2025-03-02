(function(SX, $){
    'use strict';
    
    console.log('StationX in Visualizer: ', SX );
    if( SX.Visualizer ){
        console.log( 'SXVisualizer already loaded.');
        return;
    }


    class Visualizer {
        #menus;
        #namespace;
        #portletId;
        #resourceURL;
        #connector;
        #eventHandlers;

        get menus(){
            return this.#menus;
        }

        set menus( val ){
            this.#menus = val;
        }

        get portletId(){
            return this.#portletId;
        }

        set portletId( portletId ){
            this.#portletId = portletId;
        }

        constructor( config ){
            this.#portletId = config.portletId;
            this.#namespace  = config.namespace;
            this.#resourceURL = config.resourceURL;
            this.#connector = config.connector;
            this.#eventHandlers = config.eventHandlers;
    
            this.loadCanvasFunc = config.loadCanvas;
            this.canvas = config.displayCanvas;
            this.menuOptions = config.menuOptions;
            
            this.disabled = config.disabled;
            this.initData = null;
    
            this.currentData = null;
            this.baseFolder = '';
            this.procFuncs = {};
    
            this.attachedEventHandlers = {};
            this.fileExplorerId;
            this.fileExplorerDialog;
            this.dirDirty = false;

            //Add custom proc funcs
            for( let funcName in config.procFuncs ){
                let funcs;
                if( this.procFuncs.hasOwnProperty(funcName) ){
                    funcs = this.procFuncs[funcName];
                }
                else{
                    funcs = [];
                    this.procFuncs[funcName] = funcs;
                }
                funcs.push( config.procFuncs[funcName] );
            }
           
            //Set currentData and baseFolder if initData exists
            if( !$.isEmptyObject(this.initData) ){
                this.setBaseFolderAndCurrentData();
            }

            //Hides un-needed menu
            if( !$.isEmptyObject(this.menuOptions ) ){
                if( this.menuOptions.menu === false )           $('#'+this.#namespace+'menu').remove();
                if( this.menuOptions.sample === false )         $('#'+this.#namespace+'sample').remove();
                if( this.menuOptions.upload === false )         $('#'+this.#namespace+'upload').remove();
                if( this.menuOptions.download === false )       $('#'+this.#namespace+'download').remove();
                if( this.menuOptions.openLocalFile === false )  $('#'+this.#namespace+'openLocalFile').remove();
                if( this.menuOptions.openServerFile === false ) $('#'+this.#namespace+'openServerFile').remove();
                if( this.menuOptions.saveAtLocal === false )    $('#'+this.#namespace+'saveAtLocal').remove();
                if( this.menuOptions.saveAtServer === false ){
                        $('#'+this.#namespace+'save').remove();
                        $('#'+this.#namespace+'saveAs').remove();
                }
            }

            // Set namespace on iframe if canvas is iframe
            
            if( this.canvas.tagName.toLowerCase() === 'iframe' ){
                // console.log('Visualizer setNamespace!!');
                if(this.canvas.contentWindow['setNamespace']){
                    this.canvas.contentWindow['setNamespace']( this.#namespace );
                }else{
                    setTimeout(function(){ 
                        this.canvas.contentWindow['setNamespace']( this.#namespace );
                    }, 500)
                }
                
                if( this.disabled )
                this.canvas.contentWindow['disable']( this.disabled );
            }

            this.#attachEventHandlers();

            //Attach default proc functions
            this.procFuncs.readServerFile = [
                this.readServerFile
            ];
            this.procFuncs.saveAtServerAs = [
                this.saveAtServerAs
            ];
            this.procFuncs.readServerFileURL = [
                this.readServerFileURL
            ];

            /**
             * The following block will be enabled after OSP_HANDSHAKE event is deprecated.  
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
            let portlet = $('#p_p_id'+this.#namespace);
            if( !portlet[0] ){
                portlet = $('#'+this.#namespace).parent();
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
                formData.append( this.namespace+key, jsonData[key] );
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
        			fileInfoObj.type = OSP.Enumeration.PathType.FILE;
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
                setCurrentData( jsonData );
            }
            let params = {
                command:'READ_FILE',
                repositoryType: baseFolder.repositoryType(),
                userScreenName: currentData.user(),
                dataType: currentData.dataType(),
                pathType: currentData.type(),
                parentPath: currentData.parent(),
                fileName: currentData.name()
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
                            type: OSP.Enumeration.PathType.FILE_CONTENT,
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
                this.setCurrentData( jsonData );
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
                            type: OSP.Enumeration.PathType.STRUCTURED_DATA,
                            dataType_:{
                                name: data.dataTypeName,
                                version:data.dataTypeVersion
                            },
                            content_:JSON.parse( data.structuredData )
                        };
                        this.setCurrentData( result );

                        this.loadCanvas( SX.Util.toJSON(currentData, changeAlert) );
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

            SX.Debug.eventTrace('getFirstFileName()', 'Params', params);

            if( baseFolder.type() === SX.Enum.PathType.EXT){
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
                            type: SX.Constants.PathType.FILE,
                            parent: data.parentPath,
                            name:data.fileName
                        };
                        SX.Debug.eventTrace('result of getFirstFileName', data, result);
                        this.setCurrentData( result );

                        successFunc();
                        //loadCanvas( OSP.Util.toJSON(currentData), false);
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
                this.loadCanvas( SX.Util.toJSON(this.currentData), changeAlert );
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
            if( !this.dirDirty ){
                return;
            }

            let eventData = {
                        portletId: this.portletId,
                        targetPortlet: this.fileExplorerId,
                        data: {
                                repositoryType_: this.baseFolder.type(),
                                user_: this.currentData.user(),
                                type: SX.Constants.PathType.FILE,
                                parent: this.currentData.parent(),
                                name: this.currentData.name()
                        },
                        params:{
                            changeAlert:false
                        }
            };
            Liferay.fire(SX.Constants.Event.LOAD_DATA, eventData );

            this.dirDirty = false;
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
                    this.dirDirty = true;
                },
                error: function(data, e ){
                    console.log('Error read file: ', data, e);
                },
                complete: this.unblockVisualizer
            });
        }

        setCurrentData( jsonData ){
            if( jsonData ){
                this.currentData.deserialize( jsonData );
                if( this.currentData.type() === SX.Constants.PathType.FOLDER &&
                    this.baseFolder.type() === SX.Constants.PathType.EXT ){
                    this.currentData.type( this.baseFolder.type() );
                    this.currentData.name( this.baseFolder.name() );
                }
            }
        }

        runProcFuncs( func ){
            let args = Array.prototype.slice.call(arguments);
            console.log('runProcFuncs: ', args);
            let newArgs = [];
            let funcName = args[0];
            for (let i = 1; i < args.length; i++) {
                newArgs.push(args[i]);
            }

            let funcs = this.procFuncs[funcName];
            if( !funcs ){
                console.log('Proc Functions not exist: '+ funcName, this.procFuncs );
                return;
            } 
            // run all functions name by funcName
            //console.log( 'funcs: ', funcs );
            funcs.forEach(function( func){
                func.apply(null, newArgs);
            });
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
            
            $.ajax({
                url : this.resourceURL,
                type : 'POST',
                data : formData,
                dataType:'json',
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                beforeSend: this.blockVisualizer,
                success : function(result) {
                    let jsonData = {
                        type: SX.Constants.PathType.CONTENT,
                        content_: result
                    };
                    this.setCurrentData( jsonData );
                    this.loadCanvas( SX.Util.toJSON(currentData), changeAlert );
                },
                error: function(data, e ){
                    this.errorFunc(data, e);
                },
                complete: this.unblockVisualizer
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
                        this.currentData.type( SX.Constants.PathType.FILE );
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
                        this.currentData.type( SX.Constants.PathType.FILE );
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
            dialog.find( '#'+this.namespace+'targetFilePath').val(SX.Util.mergePath(this.currentData.parent(), targetFileName));
            dialog.dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    'OK': function(){
                        let targetPath = dialog.find( '#'+this.namespace+'targetFilePath').val();
                        let path = SX.Util.convertToPath( targetPath );
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
            formData.append(this.namespace+'target', SX.Util.mergePath(this.currentData.parent(), targetFileName));
            
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
                    type: SX.Constants.PathType.URL,
                    content_: this.serveResourceURL.toString()
                };

                this.setCurrentData( jsonData );
                this.loadCanvas( SX.Util.toJSON(this.currentData), changeAlert);
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
            data[this.namespace+'command'] = SX.Constants.Commands.DOWNLOAD;
            data[this.namespace+'repositoryType'] = this.baseFolder.repositoryType();
            data[this.namespace+'userScreenName'] = this.currentData.user();
            data[this.namespace+'parentPath'] = this.currentData.parent();
            data[this.namespace+'fileNames'] = JSON.stringify(fileNames);

            let url = resourceURL + separator + $.param(data);
            
            window.location.href = url;
        }

        attachEventHandler( event, handler ){
            if( this.attachedEventHandlers[event] ){
                Liferay.detach( event, this.attachedEventHandlers[event] );
            }
            else{
                this.attachedEventHandlers[event] = function( e ){
                	if( e.targetPortlet !== this.portletId ) return;
            		if(event === SX.Constants.Events.CHECK_MANDATORY){
                    	let isPassed = handler( e.data, e.params );
                    	return isPassed;
                    }else{
                    	handler( e.data, e.params );
                    }
                };
            }
            Liferay.on( event, this.attachedEventHandlers[event] );
        }

        setBaseFolderAndCurrentData(){
            this.currentData = new SX.InputData( this.initData );
            this.currentData.dirty(false);
            this.baseFolder = new SX.InputData();

            for( let key in this.initData ){
                switch( key ){
                    case SX.Constants.TYPE:
                        if( this.initData[key] !== SX.Constants.PathType.FOLDER && 
                            this.initData[key] !== SX.Constants.PathType.EXT ){
                            this.baseFolder.type( SX.Constants.PathType.FOLDER );
                        }
                        else{
                            this.baseFolder.type( this.initData[key] );
                        }
                        break;
                    default:
                        this.baseFolder[key] = this.initData[key];
                        break;
                }
            }

            if( !this.baseFolder.repositoryType() ){
                console.log('[WARNING] Portlet '+this.portletId+' baseFolder has no repositoryType!');
            }

        }

        defaultHandshakeEventHandler( data, params ){
            //connector, disabled, and Base folder information
           this.connector = config.connector = params.connector;
           this.disabled = params.disabled;

           this.processInitAction(data, false);
            // console.log('baseFolder: ', baseFolder );
            
            let eventData = {
                        portletId: this.portletId,
                        targetPortlet: params.connector,
                        data: [],
                        params: params
            };

            Liferay.fire( SX.Constants.Events.SX_REGISTER_EVENTS, eventData );
        }

        defaultEventsResigeteredEventHandler( jsonData, params ){
        } 

        defaultDisableControlsEventHandler( data, params ){
            this.disabled = data;
            if( this.canvas.tagName.toLowerCase() === 'iframe' && this.canvas.contentWindow['disable']){
                this.canvas.contentWindow['disable']( this.disabled );
            }
        }
        
        defaultCheckMandatoryEventHandler(){
            let eventData = {
                        targetPortlet : this.portletId
            };
            Liferay.fire( SX.Constants.Events.SX_CHECK_MANDATORY , eventData );
        }

        #attachEventHandlers(){
           // console.log( 'Event Handlers: ', eventHandlers);
            for( let event in this.#eventHandlers){
            	let handler = this.#eventHandlers[event];
                this.attachEventHandler( event, handler);
            }
            
            if( ! this.#eventHandlers.hasOwnProperty(SX.Events.SX_HANDSHAKE ) ){
                this.attachEventHandler( SX.Events.SX_HANDSHAKE, this.defaultHandshakeEventHandler );
            }
            if( ! this.#eventHandlers.hasOwnProperty( SX.Events.SX_EVENTS_REGISTERED ) ){
                this.attachEventHandler(  SX.Events.SX_EVENTS_REGISTERED, this.defaultEventsResigeteredEventHandler );
            }
            if( ! this.#eventHandlers.hasOwnProperty( SX.Events.SX_DISABLE_CONTROLS ) ){
                this.attachEventHandler(  SX.Events.SX_DISABLE_CONTROLS, this.defaultDisableControlsEventHandler );
            }
            if( ! this.#eventHandlers.hasOwnProperty( SX.Events.SX_CHECK_MANDATORY ) ){
            	this.attachEventHandler( SX.Events.SX_CHECK_MANDATORY, this.defaultCheckMandatoryEventHandler);
            }
        }

        createEventData( data, params ){
            return {
                portletId: this.portletId,
                targetPortlet: this.connector,
                data: data ? data : undefined,
                params: params ? params : undefined
            };
        }

        fireMadatoryCheckEvent(){
            let isPassed = Liferay.fire( SX.Constants.Event.SX_CHECK_MANDATORY, {targetPortlet : this.portletId});
            return isPassed;
        }

        fireRegisterEventsEvent( data, params ){
            // console.log( '++++ EventData: ', createEventData(data, params ));
            Liferay.fire( SX.Constants.Events.SX__REGISTER_EVENTS, this.createEventData(data, params ));
        }

        fireDataChangedEvent( data, params ){
            if( data ){
            	if(!data.type){
            		if(this.currentData.type()===SX.Constants.PathType.FILE_CONTENT){
            			data.type = this.currentData.type();
            		}
            	}
            	
                this.setCurrentData( data );
                this.currentData.dirty(true);
            }
            // console.log('Fire data changed event: ', currentData );
            let eventData = data ? data : SX.Util.toJSON(this.currentData);

            this.checkInputPortsType(eventData);
            
            Liferay.fire( SX.Constants.Events.SX_DATA_CHANGED, this.createEventData(eventData, params ) );
        }
        
        /* Strucutred Data's Port type check */
        checkInputPortsType(data) {
        	let inputsType = data[SX.Constants.TYPE];
        	if(inputsType === SX.Constants.PathType.FILE_CONTENTS) {
        		let fileContents = data[SX.Constants.CONTENT];
        		if( fileContents.fileCount === 1 ) {
        			data[SX.Constants.TYPE] = SX.Constants.PathType.FILE_CONTENT
        			data[SX.Constants.CONTENT] = ( fileContents.content[0].join('') );
        		}
        	}
        }

        fireSampleSelectedEvent( data, params ){
            Liferay.fire( SX.Constants.Events.SX_SAMPLE_SELECTED, this.createEventData(data, params) );
        }

        fireRequestSampleContentEvent( data, params ){
            console.log("sampleFileRead")
            console.log(this.createEventData(data, params))
        	Liferay.fire( SX.Constants.Events.SX_REQUEST_SAMPLE_CONTENT, this.createEventData(data, params) );
        }

        fireRequestSampleURL( data, params ){
            Liferay.fire( SX.Constants.Events.SX_REQUEST_SAMPLE_URL, this.createEventData(data, params) );
        }

        fireRequestDataEvent( targetPortlet, data, params ){
            let eventData = {
                portletId: this.portletId,
                targetPortlet: targetPortlet,
                data: data,
                params: params
            };

            Liferay.fire( SX.Constants.Events.SX_REQUEST_DATA, eventData );
        }

        fireResponseDataEvent( jsonData, params ){
            console.log('Fire response data event: ', jsonData, params );
            
            Liferay.fire( SX.Constants.Events.SX_RESPONSE_DATA, this.createEventData( jsonData, params ) );
        }

        openHtmlIndex( jsonData, changeAlert ){
            console.log('openHtmlIndex: ', jsonData, changeAlert);
            if( jsonData ){
                this.setCurrentData( jsonData );
            }

            let params = {
                command: 'READ_HTML_INDEX_URL',
                repositoryType: this.baseFolder.repositoryType(),
                userScreenName: this.currentData.user(),
                pathType: SX.Constants.PathType.FILE,
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
                        type: SX.Constants.PathType.URL,
                        content:  SX.Util.mergePath( result.parentPath, result.fileName),
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
                this.setCurrentData( jsonData );
            }

            let params = {
                command: SX.Constants.Commands.SX_GET_COPIED_TEMP_FILE_PATH,
                repositoryType: this.baseFolder.repositoryType(),
                userScreenName: this.currentData.user(),
                pathType: this.currentData.type(),
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
                        type: SX.Constants.PathType.URL,
                        content: contextPath+'/'+SX.Util.mergePath( result.parentPath, result.fileName ),
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
            let domFileSelector = $('<input type=\"file\" id=\"'+this.namespace+'selectFile\"/>');
            domFileSelector.click();
            domFileSelector.on(
                'change',
                function(event){
                    let reader = new FileReader();
                    let fileName = '';
                    
                    fileName = SX.Util.getLocalFileName(this);
                    let file = SX.Util.getLocalFile( this );
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
                                result.type = SX.Constants.PathType.URL;
                                break;
                            default:
                                result.type = SX.Constants.PathType.CONTENT;
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
                case SX.Constants.PathType.FILE_CONTENT:
                case SX.Constants.PathType.FILE:
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
                    let localFile = SX.Util.getLocalFile( this );
                    let defaultTargetFileName = SX.Util.getLocalFileName( this );
                    this.uploadFile( localFile,  defaultTargetFileName, successFunc );
                }
            );
        }

        getFolderInfo( folderPath, extension, changeAlert){
            let params = {};
            params.command = SX.Constants.Commands.SX_GET_FILE_INFO;
            params.repositoryType = this.baseFolder.repositoryType();
            params.userScreenName = this.currentData.user();
            params.parentPath = folderPath;

            if( this.baseFolder.type() === SX.Constants.PathType.EXT ){
                params.pathType = SX.Constants.PathType.EXT;
                params.fileName = extension;
            }
            else{
                params.pathType = SX.Constants.PathType.FOLDER;
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
                        type: SX.Constants.PathType.FOLDER_CONTENT,
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


        loadCanvas( jsonData, changeAlert ){
            // console.log('loadCanvas data: ', jsonData, changeAlert );
        	this.setCurrentData( jsonData );
            this.loadCanvasFunc( SX.Util.toJSON(currentData), changeAlert);
        }

        downloadResultFile(){
        	let sendData = Liferay.Util.ns(this.namespace, {
        		parentPath : this.currentData.parent,
        		fileName : this.currentData.name,
        		repositoryType : SX.Constants.RepositoryTypes.USER_JOBS,
        		command : SX.Constants.Commands.SX_DOWNLOAD_WITH_IB
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
                case SX.Constants.PathType.FILE:
                case SX.Constants.PathType.FILE_CONTENT:
                    let fileNames = [this.currentData.name()];
                    this.downloadFiles( fileNames);
                    break;
                case SX.Constants.PathType.CONTENT:
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
                case SX.Constants.PathType.URL:
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
                initData.type = jsonData.type ? jsonData.type : SX.Constants.PathType.FOLDER;
                initData.parent = jsonData.parent ? jsonData.parent : '';
                initData.name = jsonData.name ? jsonData.name : '';
            }
            
            this.setBaseFolderAndCurrentData();
            // console.log( 'After processInitAction: ', currentData );
            if( launchCanvas ){
                this.loadCanvas( SX.Util.toJSON(currentData), changeAlert );
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
                    type: SX.Constants.PathType.FILE_CONTENT,
                    content: content
                };

                this.setCurrentData( jsonData );
            }
            
            this.openServerFileExplorer('saveAtServerAs');
        }
    }

    SX.Visualizer = Visualizer;

})(StationX, jQuery);
