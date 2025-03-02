(function(window){
    'use strict';

    if( window.OSP ){
        if( OSP.Layouts )    return;
    }
    else
        window.OSP = {};
    
    OSP.Layouts = function(jsonLayouts){
    	var Layouts = this;
        OSP._MapObject.apply( Layouts );
        
        Layouts.isStepLayout = function(type){
        	return Layouts.property.apply(Layouts, OSP.Util.addFirstArgument(OSP.Constants.IS_STEP_LAYOUT, arguments));
        };
        
        Layouts.arrayKeys = function(keys){
        	return Layouts.property.apply(Layouts, OSP.Util.addFirstArgument(OSP.Constants.ARRAY_KEYS, arguments));
        };
        
        Layouts.getLayoutFromKey = function(key){
        	var layout = new OSP.Layout(Layouts[key]);
        	return layout;
        };
        
        Layouts.addKey = function(key){
        	var keys = Layouts.arrayKeys();
        	if(!keys){
        		keys = [];
        		Layouts.arrayKeys(keys);
        	}
        	
        	if(!Layouts.arrayExist(keys,key)){
        		keys.push(key);
        	}
        };
        
        
        Layouts.addLayout = function(key,layout){
        	layout[OSP.Constants.LAYOUT_NAME] = key;
        	
        	Layouts.addKey(key);
        	Layouts[key] = layout;
        	
        	return Layouts;
        };
        
        Layouts.getLayouts = function(){
        	var keys = Layouts.arrayKeys();
        	
        	var layoutArray = [];
        	for( var index in keys){
        		var key = keys[index];
        		var layout = Layouts.getLayoutFromKey(key);
        		layoutArray.push(layout);
        	}
        	
        	return layoutArray;
        	
        };
        
        Layouts.deserialize = function( jsonLayouts ){
        	for( var key in jsonLayouts ){
        		var value = jsonLayouts[key];
        		switch( key ){
        			case OSP.Constants.IS_STEP_LAYOUT:
        				Layouts.property( key, value );
						break;
        			case OSP.Constants.ARRAY_KEYS:
        				Layouts.property( key, value );
						break;
        			case OSP.Enumeration.LayoutKey.LAYOUT:
        			case OSP.Enumeration.LayoutKey.INPUT:
        			case OSP.Enumeration.LayoutKey.LOG:
        			case OSP.Enumeration.LayoutKey.OUTPUT:
        				Layouts.property( key, value );
						break;
        			default:
        				Layouts._deserialize( key, value );
        		}
        	}
        };
        
        if( arguments.length === 1 ){
        	Layouts.deserialize( jsonLayouts );
        };
    };
    
    OSP.Layout = function( jsonLayout ){
        var Layout = this;
        OSP._MapObject.apply( Layout );

        var Portlet = function( jsonPortlet ){
            var P = this;
            OSP._MapObject.apply(P);

            P.instanceId = function( instanceId ){
                return P.property.apply(P, OSP.Util.addFirstArgument(OSP.Constants.INSTANCE_ID, arguments));
            };
            
            P.portName = function( portName ){
                if( portName === '' )   return false;
                return P.property.apply(P, OSP.Util.addFirstArgument(OSP.Constants.PORT_NAME, arguments));
            };
            
            P.portType = function( type ){
                return P.property.apply(P, OSP.Util.addFirstArgument(OSP.Constants.TYPE, arguments));
            };

            P.generateInstanceId = function( instanceIndex ){
                var instanceId = P.instanceId();
                if( instanceId.indexOf('_INSTANCE_') > 0){
                	var isNum = instanceId.replace(/[^0-9]/g, "");
                	if(!isNaN(isNum)&&isNum!=""){
                		instanceId = instanceId.slice(0,instanceId.length-5);
                	}
                	
                	var instanceString;
                	var idStr = "" + instanceIndex;
                	var pad = "0000";
                	var instanceString = pad.substring(0, pad.length - idStr.length) + idStr;
                	P.instanceId(instanceId+'_'+instanceString);
                }
                
                return P.instanceId();
            };
            
            P.getRootId = function(){
                var instanceId = P.instanceId();
                var index = instanceId.indexOf('_INSTANCE_');
                if( index < 0 )
                    return instanceId;
                else
                    return instanceId.slice(0, instanceId.indexOf('_INSTANCE_'));
            };

            P.getNamespace = function(){
                return '_'+P.instanceId()+'_';
            };

            P.status = function( status ){
                return P.property.apply(P, OSP.Util.addFirstArgument(OSP.Constants.STATUS, arguments));
            };

            P.preferences = function( preferences ){
                return P.property.apply(P, OSP.Util.addFirstArgument(OSP.Constants.PREFERENCES, arguments));
            };
            
            P.addPreference = function( key, value ){
                var preferences = P.preferences();
                switch( arguments.length){
                case 1:
                    if( !preferences )  return '';
                    return preferences[key];
                case 2:
                    if( !preferences ){
                        preferences = [];
                        P.preferences( preferences );
                    }
                    return preferences[key] = value;
                default:
                    console.log( 'Arguments mismatch: Portlet.preference.');
                    return false;
                }
            };

            P.removePreference = function( preference ){
                var preferences = P.preferences();
                if( !preferences )  return true;
                return delete preferences[preference];
            };
            
            P.events = function( events ){
                return P.property.apply(P, OSP.Util.addFirstArgument(OSP.Constants.EVENTS, arguments));
            };
            
            P.checkEvent = function( event ){
                var events = P.events();
                if( !events )   return false;
                
                for( var index in events ){
                    if( event === events[index] )
                        return true;
                }
                
                return false;
            };
            
            P.display = function( displayOption ){
                var $portletDiv = $('#'+P.getNamespace());
                if( $portletDiv.length > 0 ){
                    $portletDiv.css('display', displayOption);
                    return true;
                }
                else
                    return false;
            };
            
            P.load = function( $targetDiv, connector, eventEnable, windowState, callback ){
                AUI().use('liferay-portlet-url', function(A){
                    var portletURL = Liferay.PortletURL.createRenderURL();
                    portletURL.setPortletId( P.instanceId() );
                    portletURL.setParameter( 'eventEnable', eventEnable);
                    portletURL.setParameter( 'connector', connector);
                    portletURL.setWindowState(windowState);

                    $.ajax({
                        url: portletURL.toString(),
                        type:'POST',
                        async: false,
                        dataType:'text',
                        success: function( renderResult ){
                            if(typeof $targetDiv.attr("section-type")!="undefined"){
                                $targetDiv.html( renderResult );
                            }else{
                                var $portletDiv = $('<div>');
                                console.log(P.getNamespace());
                                $portletDiv.attr('id', P.getNamespace());
                                $portletDiv.css('height', "inherit");
                                $portletDiv.html( renderResult );
                                $targetDiv.append( $portletDiv );
                            }
                            
                            P.status(true);
                            callback( connector, P.instanceId() );
                        },
                        error: function(){
                            console.log('AJAX loading failed', P);
                        }
                    });
                }); 
            };
            
            P.fire = function( event, sourcePortlet, data ){
                if( !P.checkEvent(event) )
                    return false;
                
                var eventData = {
                        portletId: sourcePortlet,
                        targetPortlet: P.instanceId(),
                        data: data
                };
                
                Liferay.fire( event, eventData);
            };
            
            P.fireLoadData = function( connector ){
                var data = P.data();
                if( !data ) return false;
                
                P.fire( OSP.Event.OSP_LOAD_DATA, connector, data );
            };

            P.clone = function(){
                return new Portlet( OSP.Util.toJSON(P) );
            };

            P.deserialize = function( jsonPortlet ){
                for( var key in jsonPortlet ){
                    switch( key ){
                    case OSP.Constants.INSTANCE_ID:
                    case OSP.Constants.PREFERENCES:
                    case OSP.Constants.PORT_NAME:
                    case OSP.Constants.REPOSITORY_TYPE:
                        P.property( key, jsonPortlet[key] );
                        break;
                    default:
                        console.log( 'Un-recognizable Portlet property: '+key);
                    }
                }
            };

            if( arguments.length === 1 )
                P.deserialize( jsonPortlet );
        }; // End of Portlet
        Layout.newPortlet = function(jsonPortlet ){
            return new Portlet(jsonPortlet);
        };
        
        var Column = function( jsonColumn ){
            var C = this;
            OSP._MapObject.apply(C);
            
            // Column Definitions
            C.id = function( id ){
                return C.property.apply(C, OSP.Util.addFirstArgument(OSP.Constants.ID, arguments));
            };
            
            C.height = function( height ){
                return C.property.apply(C, OSP.Util.addFirstArgument(OSP.Constants.HEIGHT, arguments));
            };
            
            C.width = function( width ){
                return C.property.apply(C, OSP.Util.addFirstArgument(OSP.Constants.WIDTH, arguments));
            };
            
            C.currentPortletId = function( instanceId ){
                return C.property.apply(C, OSP.Util.addFirstArgument(OSP.Constants.CURRENT_PORTLET, arguments));
            };
            
            C.getCurrentPortlet = function(){
                var portletAry = C.getPortlet( C.currentPortletId() );
                if( protletAry.length === 0 )
                    return portletAry[0];
                else
                    return false;
            };

            C.portlets = function( portlets ){
                return C.property.apply(C, OSP.Util.addFirstArgument(OSP.Constants.PORTLETS, arguments));
            };
            
            C.getPortlet = function( instanceId ){
                var portlets  = C.portlets();
                if( !portlets ) false;
                
                for( var index in portlets ){
                    var portlet = portlets[index];
                    if( instanceId === portlet.instanceId() )
                        return portlet;
                }
                return false;
            };
            
            C.getPortlets = function( portName ){
                var portlets  = C.portlets();
                if( !portlets ) false;
                
                var retrievedPortlets = [];
                for( var index in portlets ){
                    var portlet = portlets[index];
                    if( portName === portlet.portName() )
                        retrievedPortlets.push( portlet );
                }
                return retrievedPortlets;
            };
            
            C.addPortlet = function( portlet ){
                var portlets = C.portlets();
                if( !portlets ){
                    portlets = [];
                    C.portlets(portlets);
                }

                for( var index in portlets ){
                    var savedPortlet = portlets[index];
                    if( portlet.instanceId() === savedPortlet.instanceId() ){
                        console.log('ERROR]portlet is already assigned to the column: '+portlet.instanceId());
                        return false;
                    }
                }
                
                portlets.push(portlet);
                
                return portlets;
            };
            
            C.removePortlet = function( instanceId ){
                var portlets = C.portlets();
                if( !portlets ){
                    return false;
                }
                
                for( var index in portlets ){
                    var portlet = portlets[index];
                    if( portlet.instanceId() === instanceId ){
                        portlets = OSP.Util.removeArrayElement( portlets, index );
                    }
                }
                
                return portlets;
            };
            
            C.removePortlets = function( portName ){
                var portlets = C.portlets();
                if( !portlets ){
                    return false;
                }
                
                for( var index in portlets ){
                    var portlet = portlets[index];
                    if( portlet.portName() === portName ){
                        portlets = OSP.Util.removeArrayElement( portlets, index );
                    }
                }
                
                return portlets;
            };
            
            C.isAssigned = function( portName /* or portlet instance id */ ){
                var portlets = C.portlets();
                if( !portlets ){
                    return false;
                }
                
                var instanceId = portName;
                for( var index in portlets ){
                    var portlet = portlets[index];
                    if( portName === portlet.portName() || instanceId === portlet.instanceId() ){
                        return true;
                    }
                }
                return false;
            };
            
            C.loadPortlet = function( targetPortlet, connector, eventEnable, windowState, callback ){
                if( targetPortlet.status() ){
                    targetPortlet.display( 'block' );
                    return true;
                }
                
                targetPortlet.status( true );
                var $targetDiv = $('#'+C.getPortletSectionId(connector));
                targetPortlet.load( $targetDiv, connector, eventEnable, windowState, callback );
            };
            
            C.switchPortlet = function( targetPortlet, connector, eventEnable, windowState, callback){
                var currentPortletId = C.currentPortletId();
                if( !currentPortletId ) return false;
                
                var currentPortlet = C.getPortlet( currentPortletId );
                currentPortlet.display( 'none' );

                var $targetDiv = $('#'+C.getPortletSectionId(connector));
                $targetDiv.effect("highlight", {color:"#F5F6CE"}, 2000);
                C.loadPortlet( targetPortlet, connector, eventEnable, windowState, callback);
                
                C.currentPortletId(targetPortlet.instanceId());
            };
            C.getPortletSectionId = function(callerId){
                    return OSP.Event.getNamespace(callerId)+C.id();
            };
            
            C.clone = function(){
                return new Column( OSP.Util.toJSON(C) );
            };

            C.deserialize = function( jsonColumn ){
                for( var key in jsonColumn ){
                    switch( key ){
                    case OSP.Constants.ID:
                    case OSP.Constants.WIDTH:
                    case OSP.Constants.HEIGHT:
                    case OSP.Constants.CURRENT_PORTLET:
                        C.property( key, jsonColumn[key] );
                        break;
                    case OSP.Constants.PORTLETS:
                        var jsonPortlets = jsonColumn[key];
                        for( var index in jsonPortlets ){
                            C.addPortlet( new Portlet(jsonPortlets[index]) );
                        }
                        break;
                    default:
                        console.log( 'Un-recognizable Portlet property: '+key);
                    }
                }
            };
            
            if( arguments.length === 1 )
                C.deserialize( jsonColumn );
            
        }; /* End of Column */
        
        Layout.newColumn = function( jsonColumn ){
        	return new Column( jsonColumn );
        };
        
        Layout.templateId = function( templateId ){
        	return Layout.property.apply(Layout, OSP.Util.addFirstArgument(OSP.Constants.TEMPLATE_ID, arguments));
        };
        
        Layout.layoutName = function( layoutName ){
        	return Layout.property.apply(Layout, OSP.Util.addFirstArgument(OSP.Constants.LAYOUT_NAME, arguments));
        };
        
        Layout.columns = function( columns ){
        	return Layout.property.apply(Layout, OSP.Util.addFirstArgument(OSP.Constants.COLUMNS, arguments));
        };
        
        Layout.getColumnIds = function(){
        	var columns = Layout.columns();
        	if( !columns )  return [];
        	
        	var columnIds = [];
        	for( var index in columns ){
        		var column = columns[index];
        		columnIds.push( column.id() );
        	}
        	return columnIds;
        };
        
        var Devider = function( jsonDevider ){
            var D = this;
            OSP._MapObject.apply(D);
            
            D.id = function( id ){
                return D.property.apply(D, OSP.Util.addFirstArgument(OSP.Constants.ID, arguments));
            };
            
            D.left = function( left ){
                return D.property.apply(D, OSP.Util.addFirstArgument(OSP.Constants.LEFT, arguments));
            };
            
            D.top = function( top ){
                return D.property.apply(D, OSP.Util.addFirstArgument(OSP.Constants.TOP, arguments));
            };
            
            D.deserialize = function( jsonDevider ){
            	for( var key in jsonDevider ){
            		switch( key ){
        				case OSP.Constants.ID:
        				case OSP.Constants.LEFT:
        				case OSP.Constants.TOP:
        					D.property( key, jsonDevider[key] );
                            break;
        			default:
                        console.log( 'Un-recognizable Devider property: '+key);
                    }
        		}
        	};
            
            if( arguments.length === 1 ){
            	D.deserialize( jsonDevider );
            };
        };
        
        Layout.newDevider = function( jsonDevider ){
        	return new Devider( jsonDevider );
        };
        

        Layout.deviders = function( deviders ){
        	return Layout.property.apply(Layout, OSP.Util.addFirstArgument(OSP.Constants.DEVIDER, arguments));
        };
        
        Layout.addDevider = function( devider ){
            var deviders = Layout.deviders();
            if( !deviders ){
            	deviders = [];
                Layout.deviders(deviders);
            } 
            
            deviders.push(devider);
            return deviders;
        };
        
        Layout.getDevider = function( deviderId ){
        	var deviders = Layout.deviders();
            if( !deviders )  return false;
            
            for( var index in deviders ){
                var devider = deviders[index];
                if( devider.id() === deviderId )
                    return devider;
            }
            
            return false;
        };
        
        Layout.addDeviderObject = function( deviderId, left, top){
            var devider = Layout.getDevider(deviderId);
            if( !devider ){
            	devider = new Devider();
            	devider.id(deviderId);
                if(left!=''){devider.left(left);}
                if(top!=''){devider.top(top);}
                
                Layout.addDevider(devider);
            }
        };
        
        Layout.getDeviderIds = function(){
        	var deviders = Layout.deviders();
        	if( !deviders )  return [];
        	
        	var deviderIds = [];
        	for( var index in deviders ){
        		var devider = deviders[index];
        		deviderIds.push( devider.id() );
        	}
        	return deviderIds;
        };

        Layout.getPortlet = function( instanceId ){
            var columns = Layout.columns();
            if( !columns ){
                console.log('[ERROR]there is no columns to be searched: ');
                return false;
            }

            for( var index in columns ){
                var column  = columns[index];
                
                var portlet = column.getPortlet(instanceId);
                if( portlet )
                    return portlet;
            }
            return false;
        };
        
        Layout.getPortlets = function( portName ){
            var columns = Layout.columns();
            if( !columns ){
                console.log('[ERROR]there is no columns to be searched: ');
                return false;
            }

            var portlets = [];
            for( var index in columns ){
                var column  = columns[index];
                
                var columnPortlets = column.getPortlets(portName);
                if( columnPortlets.length > 0 )
                    portlets = portlets.concat( columnPortlets );
            }
            return portlets;
        };
        
        Layout.addColumn = function( column ){
            var columns = Layout.columns();
            if( !columns ){
                columns = [];
                Layout.columns(columns);
            } 
            
            columns.push(column);
            return columns;
        };

        Layout.getColumn = function( columnId ){
            var columns = Layout.columns();
            if( !columns )  return false;
            
            for( var index in columns ){
                var column = columns[index];
                if( column.id() === columnId )
                    return column;
            }
            
            return false;
        };
        
        Layout.getAssignedColumn = function( instanceId ){
            var columns = Layout.columns();
            if( !columns )  return false;
            
            for( var index in columns ){
                var column = columns[index];
                if( column.isAssigned(instanceId) ){
                    return column;
                }
            }
            
            return false;
        };

        Layout.getAssignedColumns = function( portName ){
            var columns = Layout.columns();
            if( !columns )  return false;
            
            var assignedColumns = [];
            for( var index in columns ){
                var column = columns[index];
                if( column.isAssigned(portName) ){
                    assignedColumns.push( column );
                }
            }
            
            return assignedColumns;
        };

        Layout.getVisualPortlets = function( portName ){
            var columns = Layout.columns();
            var portlets = [];
            for( var index in columns ){
                var column = columns[index];
                if( column.isAssigned( portName ) ){
                    portlets.push( column.getCurrentPortlet() );
                }
            }
            return portlets;
        };
        
        Layout.removeColumn = function( columnId ){
            var columns = Layout.columns();
            if( !columns )  return true;
            
            for( var index in columns ){
                var column = columns[index];
                if( column.id() === columnId )
                    return OSP.Util.removeArrayElement(columns, index);
            }
            
            return false;
        };
        
        Layout.hasPortlet = function( instanceId ){
            var columns = Layout.columns();
            if( !columns )  return false;
            
            for( var index in columns ){
                var column = columns[index];
                if( column.isAssigned(instanceId) === true )
                    return true;
            }
            
            return false;
        };
        
        var retriveRootPortlets = function( rootPortletId ){
            var columns = Layout.columns();
            if( !columns )  return [];
            
            var retrieved = [];
            for( var index in columns ){
                var column = columns[index];
                var portlets = column.portlets();
                for( var idx in portlets ){
                    var portlet = portlets[idx];
                    if( portlet.getRootId() === rootPortletId )
                        retrieved.push(portlet);
                }
            }
            
            return retrieved;
        };
        
        /*Add Column-Height,width logic add - GPLUS 20181002*/
        Layout.addPortlet = function(layoutName, columnId, rootId, display, portName, preferences, columnHeight, columnWidth){
            var column = Layout.getColumn(columnId);
            if( !column ){
                column = new Column();
                column.id(columnId);
                /*Add Column-Height,width*/
                if(columnHeight!=''){column.height(columnHeight);}
                if(columnWidth!=''){column.width(columnWidth);}
                
                Layout.addColumn(column);
            }
            
            var portlet = new Portlet();
            var portletId = rootId!=""?rootId+"_INSTANCE_"+layoutName:"";
            portlet.instanceId(portletId);
            if( portName )  portlet.portName(portName);
            if( preferences )   portlet.preferences( preferences );
            var retrievedPortlets = retriveRootPortlets(rootId);
            switch( retrievedPortlets.length ){
                case 0:
                    column.addPortlet( portlet );
                    if( display )
                        column.currentPortletId(portlet.instanceId());
                    return column;
                case 1:
                    var prevId = retrievedPortlets[0].instanceId();
                    var prevColumn = Layout.getAssignedColumn(prevId);
                    retrievedPortlets[0].generateInstanceId( 1 );
                    if( prevId === prevColumn.currentPortletId() )
                        prevColumn.currentPortletId( retrievedPortlets[0].instanceId() );
                    
                    portlet.generateInstanceId(2);
                    column.addPortlet(portlet);
                    if( display )
                        column.currentPortletId(portlet.instanceId());
                    return column;
                default:
                    var instanceIndex = 1;
                    var duplicated = false;
                    do{
                        for( var index in retrievedPortlets ){
                            portlet.generateInstanceId(instanceIndex);
                            if( retrievedPortlets[index].instanceId() === portlet.instanceId() ){
                                duplicated = true;
                                instanceIndex++;
                            }
                            else
                                duplicated = false;
                        }
                    }while( duplicated );

                    column.addPortlet(portlet);
                    if( display )
                        column.currentPortletId(portlet.instanceId());
                    return column;
            }
        };
        
        Layout.removeColumn = function( columnId ){
            var columns = Layout.columns();
            
            for( var index in columns ){
                var column = columns[index];
                if( columnId === column.id() )
                    return OSP.Util.removeArrayElement(columns, index);
            }

            return false;
        };

        Layout.removePortlet = function( instanceId ){
            var columns = Layout.columns();
            if( !columns ){
                console.log( "[ERROR]column does not exist: "+columnId);
                return false;
            }
            
            for( var index in columns ){
                var column = columns[index];
                column.removePortlet( instanceId );
            }
            
            return true;
        };
        
        Layout.removePortlets = function( portName ){
            var columns = Layout.columns();
            if( !columns ){
                console.log( "[ERROR]column does not exist: "+columnId);
                return false;
            }
            
            for( var index in columns ){
                var column = columns[index];
                column.removePortlets( portName );
            }
            
            return true;
        };

        Layout.loadPortlets = function( connectorId, eventEnable, windowState, callback ){
            var columns = Layout.columns();
            if( !columns )  return false;
                
            for( var index in columns ){
                var column = columns[index];
//                console.log('current column: ', column);
                console.log('current column: ', JSON.stringify(column));
                var portletId = column.currentPortletId();
                var targetPortlet;
                if( !portletId ){
//                    targetPortlet = column.getPortlets('_DOWNLOAD_')[0];
//                    column.currentPortletId( targetPortlet.instanceId() );
                }
                else{
                    targetPortlet = column.getPortlet(portletId);
                }
                
                column.loadPortlet( 
                            targetPortlet, 
                            connectorId,
                            eventEnable,
                            windowState,
                            callback 
                );
            }
        };
        
        Layout.switchPortlet = function( toPortletId, connector, eventEnable, windowState, callback ){
            var column = Layout.getAssignedColumn(toPortletId );
            if( !column )   return false;
            
            column.switchPortlet(Layout.getPortlet(toPortletId), connector, eventEnable, windowState, callback);
            return true;
        };
        
        Layout.getPortletSectionId = function( namespace, instanceId ){
            var column = Layout.getAssignedColumn( instanceId );
            if( !column ){
                console.log('[ERROR]no columns for: '+instanceId);
                return false;
            }
            
            return column.getPortletSectionId(namespace);
        };
        
        Layout.registerPortletEvents = function( instanceId, events ){
            var portlet = Layout.getPortlet(instanceId);
            if( !portlet )  return false;
            
            return portlet.events( events );
        };
        
        Layout.clone = function(){
            return new OSP.Layout( OSP.Util.toJSON(Layout) );
        };

        Layout.deserialize = function( jsonLayout ){
            for( var key in jsonLayout ){
                switch( key ){
                    case OSP.Constants.TEMPLATE_ID:
                    case OSP.Constants.LAYOUT_NAME:
                        Layout.property( key, jsonLayout[key] );
                        break;
                    case OSP.Constants.COLUMNS:
                        var columnsJson = jsonLayout[key];
                        var columns = [];
                        for( var index in columnsJson ){
                            var column = new Column( columnsJson[index] );
                            columns.push(column);
                        }
                        Layout.columns(columns);
                        break;
                    case OSP.Constants.DEVIDER:
                    	var devidersJson = jsonLayout[key];
                    	var deviders = [];
                    	for( var index in devidersJson ){
                            var devider = new Devider( devidersJson[index] );
                            deviders.push(devider);
                        }
                        Layout.deviders(deviders);
                    	break;
                    case OSP.Constants.HEIGHT:
                        break;
                    default:
                        console.log("Un-recognizable key: "+ key);
                }
            }
        };
        
        if( arguments.length === 1 )
            Layout.deserialize( jsonLayout );
        
    }; // End of Layout

    OSP.newLayout = function( jsonLayout ){
        return new OSP.Layout( jsonLayout );
    };
    
    OSP.Workbench = function( namespace ){
        if( !namespace ){
            console.log('Namespace should be provided to create a workbench instance.');
            return false;
        }
        
        
        var Workbench = this;
        OSP._MapObject.apply( Workbench );
        
        var isBlockValid = function( outputType, jobStatus ){
            switch( outputType ){
            	case OSP.Enumeration.PortType.INPUT:
            		switch( jobStatus ){
	            		case OSP.Enumeration.JobStatus.INITIALIZE_FAILED:
	                    case OSP.Enumeration.JobStatus.INITIALIZED:
	                    	return false;
	                    case OSP.Enumeration.JobStatus.SUBMISSION_FAILED:
	                    case OSP.Enumeration.JobStatus.QUEUED:
	                    case OSP.Enumeration.JobStatus.SUSPEND_REQUESTED:
	                    case OSP.Enumeration.JobStatus.SUSPENDED:
	                    case OSP.Enumeration.JobStatus.CANCEL_REQUESTED:
	                    case OSP.Enumeration.JobStatus.CANCELED:
	                    case OSP.Enumeration.JobStatus.SUCCESS:
	                    case OSP.Enumeration.JobStatus.RUNNING:
	                    case OSP.Enumeration.JobStatus.FAILED:
	                        return true;
	                    default: 
	                        console.log('[ERROR] Unknown jobStatus - isInvalid(): '+jobStatus);
	                        return false;
            		}
            		break;
                case OSP.Enumeration.PortType.LOG:
                    switch( jobStatus ){
                        case OSP.Enumeration.JobStatus.INITIALIZE_FAILED:
                        case OSP.Enumeration.JobStatus.INITIALIZED:
                        case OSP.Enumeration.JobStatus.SUBMISSION_FAILED:
                        case OSP.Enumeration.JobStatus.QUEUED:
                            return true;
                        case OSP.Enumeration.JobStatus.SUSPEND_REQUESTED:
                        case OSP.Enumeration.JobStatus.SUSPENDED:
                        case OSP.Enumeration.JobStatus.CANCEL_REQUESTED:
                        case OSP.Enumeration.JobStatus.CANCELED:
                        case OSP.Enumeration.JobStatus.SUCCESS:
                        case OSP.Enumeration.JobStatus.RUNNING:
                        case OSP.Enumeration.JobStatus.FAILED:
                            return false;
                        default: 
                            console.log('[ERROR] Unknown jobStatus - isInvalid(): '+jobStatus);
                            return false;
                    }
                    break;
                case OSP.Enumeration.PortType.OUTPUT:
                    switch( jobStatus ){
                        case OSP.Enumeration.JobStatus.INITIALIZE_FAILED:
                        case OSP.Enumeration.JobStatus.INITIALIZED:
                        case OSP.Enumeration.JobStatus.SUBMISSION_FAILED:
                        case OSP.Enumeration.JobStatus.QUEUED:
                        case OSP.Enumeration.JobStatus.SUSPEND_REQUESTED:
                        case OSP.Enumeration.JobStatus.SUSPENDED:
                        case OSP.Enumeration.JobStatus.CANCEL_REQUESTED:
                        case OSP.Enumeration.JobStatus.CANCELED:
                        case OSP.Enumeration.JobStatus.RUNNING:
                        case OSP.Enumeration.JobStatus.FAILED:
                            return true;
                        case OSP.Enumeration.JobStatus.SUCCESS:
                            return false;
                        default: 
                            console.log('[ERROR] Unknown jobStatus - isInvalid(): '+jobStatus);
                            return false;
                    }
                break;
            }
        };
        
        var isValid = function( outputType, jobStatus ){
            switch( outputType ){
                case OSP.Enumeration.PortType.LOG:
                    switch( jobStatus ){
                        case OSP.Enumeration.JobStatus.INITIALIZE_FAILED:
                        case OSP.Enumeration.JobStatus.INITIALIZED:
                        case OSP.Enumeration.JobStatus.SUBMISSION_FAILED:
                        case OSP.Enumeration.JobStatus.QUEUED:
                            return false;
                        case OSP.Enumeration.JobStatus.SUSPEND_REQUESTED:
                        case OSP.Enumeration.JobStatus.SUSPENDED:
                        case OSP.Enumeration.JobStatus.CANCEL_REQUESTED:
                        case OSP.Enumeration.JobStatus.CANCELED:
                        case OSP.Enumeration.JobStatus.SUCCESS:
                        case OSP.Enumeration.JobStatus.RUNNING:
                        case OSP.Enumeration.JobStatus.FAILED:
                            return true;
                        default: 
                            console.log('[ERROR] Unknown jobStatus - isInvalid(): '+jobStatus);
                            return false;
                    }
                    break;
                case OSP.Enumeration.PortType.OUTPUT:
                    switch( jobStatus ){
                        case OSP.Enumeration.JobStatus.INITIALIZE_FAILED:
                        case OSP.Enumeration.JobStatus.INITIALIZED:
                        case OSP.Enumeration.JobStatus.SUBMISSION_FAILED:
                        case OSP.Enumeration.JobStatus.QUEUED:
                        case OSP.Enumeration.JobStatus.SUSPEND_REQUESTED:
                        case OSP.Enumeration.JobStatus.SUSPENDED:
                        case OSP.Enumeration.JobStatus.CANCEL_REQUESTED:
                        case OSP.Enumeration.JobStatus.CANCELED:
                        case OSP.Enumeration.JobStatus.RUNNING:
                        case OSP.Enumeration.JobStatus.FAILED:
                            return false;
                        case OSP.Enumeration.JobStatus.SUCCESS:
                            return true;
                        default: 
                            console.log('[ERROR] Unknown jobStatus - isInvalid(): '+jobStatus);
                            return false;
                    }
                break;
            }
        };
        
        var fire = function( event, targetPortletId, data ){
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: targetPortletId,
                             data: data
            };
            Liferay.fire( event, eventData );
        };
        
        var fireDataChanged = function( sourcePortletId, data){
            var eventData = {
                             portletId: sourcePortletId,
                             targetPortlet: Workbench.id(),
                             data: data
            };
            Liferay.fire( OSP.Event.OSP_DATA_CHANGED, eventData );
        };
        
        var fireRefresh = function(){
            var layout = Workbench.layout();
            if( !layout )   return false;
            
            layout.fire( 
                    OSP.Event.OSP_REFRESH, 
                    {
                        portletId: Workbench.id(),
                        targetPortlet: 'BROADCAST'
                    }
            );
        };
        
        var fireCreateJob = function( inputs ){
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: Workbench.id(),
                             data: inputs
            };
            
            Liferay.fire( OSP.Event.OSP_CREATE_JOB, eventData );
        };
        
        var fireSimulationModal= function( inputs ){
            var eventData = {
                 portletId: Workbench.id(),
                 targetPortlet: Workbench.id(),
                 data: inputs
        };
    
            Liferay.fire( OSP.Event.OSP_REQUEST_SIMULATION_MODAL, eventData );
        };
        
        var fireRefreshPortsStatus = function( targetPortlet ){
            var dashboard = Workbench.dashboardPortlet();
            if( !dashboard )    return;
            
            evaluatePortsStatus();
            
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: targetPortlet,
                             data: {
                                scienceApp: Workbench.scienceApp() 
                             }
            };
            Liferay.fire( OSP.Event.OSP_REFRESH_PORTS_STATUS, eventData );
        };
        
        var firePortStatusChanged = function( portName, status ){
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: Workbench.dashboardPortlet(),
                             data: {
                                 portName: portName,
                                 status: status
                             }
            };
            
            Liferay.fire( OSP.Event.OSP_PORT_STATUS_CHANGED, eventData );
        };
        
        var fireCreateSimulationResult = function( targetPortId,data ){
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: targetPortId,
                             data: data
            };
            Liferay.fire(OSP.Event.OSP_RESPONSE_CREATE_SIMULATION_RESULT, eventData );
        };
        var fireSaveSimulationResult = function( targetPortId,data ){
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: targetPortId,
                             data: data
            };
            Liferay.fire(OSP.Event.OSP_RESPONSE_SAVE_SIMULATION_RESULT, eventData );
        };
        var fireDeleteSimulationResult = function( targetPortId,simulationUuid, status ){
            var eventData = {
                             portletId: Workbench.id(),
//                             targetPortlet: targetPortId,
                             targetPortlet: 'BROADCAST',
                             data: {
                                simulationUuid:simulationUuid,
                                status : status
                             }
            };
            Liferay.fire(OSP.Event.OSP_RESPONSE_DELETE_SIMULATION_RESULT, eventData );
        };
        
        var fireSubmitJobResult = function(data ){
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: 'BROADCAST',
                             data: data
            };
            Liferay.fire(OSP.Event.OSP_RESPONSE_SUBMIT_JOB_RESULT, eventData );
        };
        
        var fireCreateSimulationJobResult = function( targetPortId,data ){
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: targetPortId,
                             data: data
            };
            Liferay.fire(OSP.Event.OSP_RESPONSE_CREATE_SIMULATION_JOB_RESULT, eventData );
        };
        
        var fireCancelSimulationJobResult = function( targetPortId,data ){
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: targetPortId,
                             data: data
            };
            
            Liferay.fire(OSP.Event.OSP_RESPONSE_CANCLE_SIMULATION_JOB_RESULT, eventData );
        };
        
        var fireDeleteSimulationJobResult = function( targetPortId,data ){
            var eventData = {
                             portletId: Workbench.id(),
//                             targetPortlet: targetPortId,
                             targetPortlet: 'BROADCAST',
                             data: data
            };
            Liferay.fire(OSP.Event.OSP_RESPONSE_DELETE_SIMULATION_JOB_RESULT, eventData );
        };
        
        var fireRefreshJobs = function( data ){
            var eventData = {
                                portletId: Workbench.id(),
                                targetPortlet: 'BROADCAST',
                                data: data
                        };
            Liferay.fire( OSP.Event.OSP_REFRESH_JOBS, eventData );
        };
        
        var fireRefreshJobStatus = function( data ){
            
            if(Workbench.isFlowLayout()){
                var jobStatusCode = jobCodeConvertorFromStatus(data.jobStatus);
                var logPortLength = Workbench.scienceApp().logPortsArray().length
                var flowLayoutCode;
                if(jobStatusCode <=1701005){
                    flowLayoutCode = "INPUT";
                }else if(1701005 < jobStatusCode&&jobStatusCode <= 1701010 &&logPortLength > 0){
                    flowLayoutCode = "LOG";
                }else if(jobStatusCode >= 1701011){
                    flowLayoutCode = "OUTPUT";
                }else{
                    flowLayoutCode = "INPUT";
                }
                
                data.flowLayoutCode = flowLayoutCode;
            }
            
            data.workbenchType = Workbench.type();
            
            var eventData = {
                                portletId: Workbench.id(),
                                targetPortlet: 'BROADCAST',
                                data: data
                        };
            Liferay.fire( OSP.Event.OSP_REFRESH_JOB_STATUS, eventData );
        };
        
        var fireRefreshSimulations = function( data ){
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: 'BROADCAST',
                             data: data
            };
            Liferay.fire( OSP.Event.OSP_REFRESH_SIMULATIONS, eventData );
        };
        
        var fireShowJobStatus = function( data ){
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: Workbench.id(),
                             data: data
            };
            
            Liferay.fire( OSP.Event.OSP_SHOW_JOB_STATUS, eventData );
        };
        
        var fireInitializeEvent = function( portletId ){
            var portlet = Workbench.getPortlet( portletId );
            
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: portlet.instanceId()
            };
            Liferay.fire( OSP.Event.OSP_INITIALIZE, eventData );
        };
        
        var fireInitializeEvents = function( portName ){
            var layout = Workbench.layout();
            var portlets = layout.getPortlets( portName );
            
            for( var index in portlets ){
                var portlet = portlets[index];
                fireInitializeEvent( portlet.instanceId() );
            }
        };
        
        var fireRequestWorkingJobInfo = function( data ){
            var eventData = {
                             portletId: Workbench.id(),
                             targetPortlet: 'BROADCAST',
                             data: data
            };
            
            Liferay.fire(OSP.Event.OSP_REQUEST_WORKING_JOB_INFO, eventData );
        };
        
        
        var initializeAllLogPortlets = function(){
            var scienceApp = Workbench.scienceApp();
            var layout = Workbench.layout();
            
            var logPorts = scienceApp.logPorts();
            if( !logPorts ) return;
            for( var index in logPorts ){
                var logPort = logPorts[index];
                fireInitializeEvents( logPort.name() );
            }
        };

        var initializeAllOutputPortlets = function(){
            var scienceApp = Workbench.scienceApp();
            
            var outputPorts = scienceApp.outputPorts();
            if( !outputPorts ) return;
            for( var index in outputPorts ){
                var outputPort = outputPorts[index];
                fireInitializeEvents( outputPort.name() );
            }
        };
        
        var evaluatePortsStatus = function(){
            var simulation = Workbench.workingSimulation();
            var job = simulation.workingJob();
            var scienceApp = Workbench.scienceApp();

            var ports = scienceApp.inputPorts();
            if( ports ){
                for( var portName in ports ){
                    var portData = job.inputData( portName );
                    var port = ports[portName];
                    if( !portData ){
                        port.status( OSP.Enumeration.PortStatus.EMPTY );
                    }
                    else{
                        if( portData.dirty() ){
                            port.status( OSP.Enumeration.PortStatus.READY );
                        }
                        else{
                            port.status( OSP.Enumeration.PortStatus.EMPTY );
                        }
                    }
                }
            }
            
            ports = scienceApp.logPorts();
            if( ports ){
                var isLogValid = isValid( OSP.Enumeration.PortType.LOG, job.status() );
                for( var portName in ports ){
                    var port = ports[portName];
                    if( isLogValid ){
                        port.status( OSP.Enumeration.PortStatus.LOG_VALID );
                    }
                    else{
                        port.status( OSP.Enumeration.PortStatus.LOG_INVALID );
                    }
                }
            }
            
            ports = scienceApp.outputPorts();
            if( ports ){
                var isOutputValid = isValid( OSP.Enumeration.PortType.OUTPUT, job.status() );
                for( var portName in ports ){
                    var port = ports[portName];
                    
                    if( isOutputValid ){
                        port.status( OSP.Enumeration.PortStatus.OUTPUT_VALID );
                    }
                    else{
                        port.status( OSP.Enumeration.PortStatus.OUTPUT_INVALID );
                    }
                }
            }
        };
        
        var evaluatePortletType = function(){
            var scienceApp = Workbench.scienceApp();
            var layout = Workbench.layout();
            
            var columns = layout.columns();
            for(var ci in columns ){
                var column = columns[ci];
                var portlets = column.portlets();
                for( var pi in portlets ){
                    var portlet = portlets[pi];
                    
                    var portType = scienceApp.getPortType(portlet.portName());
                    if( portType )
                        portlet.portType( portType );
                }
            }
            
            console.log( 'evaluatePortletType: ', columns);
        };
        
        var createSimulation = function(portletId, title, jobTitle, jobInitData, resourceURL){
            var scienceApp = Workbench.scienceApp();
            
            var ajaxData = Liferay.Util.ns(
                                       Workbench.namespace(),
                                       {
                                           command: 'CREATE_SIMULATION',
                                           scienceAppId: scienceApp.id(),
                                           scienceAppName: scienceApp.name(),
                                           scienceAppVersion: scienceApp.version(),
                                           srcClassCode: Workbench.classId(),
                                           srcClassId: Workbench.customId(),
                                           title: Liferay.Util.escapeHTML(title),
                                           jobTitle: Liferay.Util.escapeHTML(jobTitle),
                                           jobInitData: jobInitData ? jobInitData : '' 
                                       });
            
            $.ajax({
                type: 'POST',
                url: resourceURL, 
                data  : ajaxData,
                dataType : 'json',
                success: function(jsonSimulation) {
                    
                    fireCreateSimulationResult(portletId,true);
                    var simulation = new OSP.Simulation(jsonSimulation);
                    var data = {
                        simulationUuid: simulation.uuid()
                    };
                    fireRefreshSimulations(data);
                },
                error:function(data,e){
                    console.log(data);
                    console.log('AJAX ERROR-->'+e);
                    fireCreateSimulationResult(portletId,false);
                }
            });
        };
        
        var loadSimulation = function( simulationUuid, resourceURL ){
            var data = Liferay.Util.ns(
                                       Workbench.namespace(),
                                       {
                                           command: 'LOAD_SIMULATION',
                                           simulationUuid: simulationUuid
                                       });
            
            $.ajax({
                type: 'POST',
                url: resourceURL, 
                async : false,
                data  : data,
                dataType : 'json',
                success: function(jsonSimulation) {
                    var simulation = new OSP.Simulation( jsonSimulation );
                    var scienceApp = Workbench.scienceApp();
                    simulation.runType( scienceApp.runType() );
                    Workbench.addSimulation( simulation );
                    Workbench.workingSimulation( simulation );
                    Workbench.print( 'After loading simulation');
                    
                    var data = {
                        simulationUuid: simulation.uuid()
                    }
                    fireRequestWorkingJobInfo( data ); 
                },
                error:function(data,e){
                    console.log(data);
                    console.log('AJAX ERROR-->'+e);
                }
            });
        };
        
        var saveSimulation = function( portletId, simulation, resourceURL ){
            
            var dirtyJobs = jobsToSubmitGetParameters(simulation,simulation.getDirtyJobs(), false,resourceURL);
            
            var data = Liferay.Util.ns(
                                       Workbench.namespace(),
                                       {
                                           command: 'SAVE_SIMULATION',
                                           simulationUuid: simulation.uuid(),
                                           srcClassCode: Workbench.classId(),
                                           srcClassId: Workbench.customId(),
                                           jobs: JSON.stringify(dirtyJobs)
                                       });
                
            $.ajax({
                type: 'POST',
                url: resourceURL, 
                async : false,
                data  : data,
                dataType : 'text',
                success: function(result) {
                    fireSaveSimulationResult(portletId,true);
                },
                error:function(data,e){
                    console.log(data);
                    console.log('AJAX ERROR-->'+e);
                    fireSaveSimulationResult(portletId,false);
                }
            });
        };
        
        var deleteSimulation = function(portletId, simulationUuid, resourceURL ){
            var data = Liferay.Util.ns(
                                       Workbench.namespace(),
                                       {
                                           command: 'DELETE_SIMULATION',
                                           simulationUuid: simulationUuid
                                       });
            $.ajax({
                type: 'POST',
                url: resourceURL, 
                async : false,
                data  : data,
                success: function(result) {
                    fireDeleteSimulationResult(portletId,simulationUuid,true);
                    fireRefreshSimulations({});
                },
                error:function(data,e){
                    console.log(data);
                    console.log('AJAX ERROR-->'+e);
                    fireDeleteSimulationResult(portletId,simulationUuid,false);
                }
            });
        };
        
        var submitSimulation = function( simulation, resourceURL  ){
            var scienceApp = Workbench.scienceApp();
            var simulationCreateTime = simulation.createTime();
            
            var jobsToSubmit = [];
            var dirtyJobs = simulation.getDirtyJobs();
            for( var index in dirtyJobs ){
                var job = dirtyJobs[index];
                console.log( 'dirtyJob: '+index, job);
                var inputPortNames = scienceApp.getInputPortNames();
                console.log( 'inputPortNames: ', inputPortNames );
                
                var proliferatedJobs = job.proliferate( inputPortNames );
                for( var jobIndex in proliferatedJobs ){
                    var proliferatedJob = proliferatedJobs[jobIndex];
                    
                    if( !proliferatedJob.ncores() && simulation.ncores() ){
                        proliferatedJob.ncores( simulation.ncores() );
                    }
                    
                    if( jobIndex > 0 ){
                        proliferatedJob.uuid('');
                    }
                    jobsToSubmit.push( proliferatedJob );
                }
            }
            console.log( 'Jobs To Submit: ', jobsToSubmit);
            
            $.ajax({
                url: resourceURL,
                type: 'POST',
                dataType: 'json',
                data: Liferay.Util.ns(
                                      Workbench.namespace(),
                                      {
                                          command: 'SUBMIT_JOBS',
                                          simulationUuid: simulation.uuid(),
                                          simulationTime: simulationCreateTime,
                                          scienceAppName: scienceApp.name(),
                                          scienceAppVersion: scienceApp.version(),
                                          ncores: simulation.ncores(),
                                          jobs: JSON.stringify( jobsToSubmit )
                                      }),
                success: function( submittedJob ){
                    simulation.cleanJobs();
                    
                    var data = {
                                simulationUuid: simulation.uuid(),
                                jobUuid: submittedJob.jobUuid
                    };
                    
                    fireRefreshJobs( data );
                },
                error: function( data, e ){
                    console.log(data);
                    console.log('AJAX ERROR-->'+e);
                }
            });
        };
        
        
        var submitMPJobs = function(job,resourceURL){
        	var scienceApp = Workbench.scienceApp();
        	var maxCpu = scienceApp.maxCpus();
        	var minCpu = scienceApp.minCpus();
        	var defaultCpu = scienceApp.defaultCpus();
            $.confirm({
                title: 'CPU Cores',
                content: '' +
                '<form action="" class="formName">' +
                '<div class="form-group">' +
                '<label>Enter number of cores ('+minCpu+' ~ '+maxCpu+')</label>' +
                '<input type="text" value="'+defaultCpu+'" placeholder="cores" class="cores form-control" required />' +
                '</div>' +
                '</form>',
                buttons: {
                    formSubmit: {
                        text: 'Submit',
                        btnClass: 'btn-blue',
                        action: function () {
                            var cores = this.$content.find('.cores').val();
                            if(!cores){
                                $.alert('provide a valid cores');
                                return false;
                            }else{
                                var pattern = /^\d+$/;
                                if(!pattern.test(cores)){
                                    $.alert('only number');
                                    return false;
                                }else{
                                	if(maxCpu*1<cores*1||cores*1<minCpu*1){
                                		$.alert('provide a valid cores');
                                        return false;
                                	}
                                }
                            }
                            
                            var simulation = Workbench.workingSimulation();
                            if( !job ){
                                simulation.ncores( cores );
                                jobsToSubmitGetParameters(simulation,simulation.getDirtyJobs(), true,resourceURL );
                            }else{
                                job.ncores( cores );
                                jobsToSubmitGetParameters(simulation,job, true, resourceURL );
                            }
                        }
                    },
                    cancel: function () {
                        
                    }
                },
                onContentReady: function () {
                    // bind to events
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it
                    });
                }
            });
        };
        
        var jobsToSubmitGetParameters = function(simulation, jobs, isSubmit, resourceURL ){
            var scienceApp = Workbench.scienceApp();
            
            var jobsToSubmit = [];
            var inputPortNames = scienceApp.getInputPortNames();
            
            var ncores = 0;
             var dirtyJobs = [];
            if(Array.isArray(jobs)){
                dirtyJobs = jobs;
                ncores = simulation.ncores();
            }else{
                dirtyJobs.push(jobs);
                ncores = jobs.ncores();
            }
            
            for( var index in dirtyJobs ){
                var job = dirtyJobs[index];
                console.log( 'dirtyJob: '+index, job);
                console.log( 'inputPortNames: ', inputPortNames );
                
                var proliferatedJobs = job.proliferate( inputPortNames );
                if(!proliferatedJobs){return false;}
                
                for( var jobIndex in proliferatedJobs ){
                    var proliferatedJob = proliferatedJobs[jobIndex];
                    
                    if( jobIndex > 0 ){
                        proliferatedJob.uuid('');
                    }
                    jobsToSubmit.push( proliferatedJob );
                }
            }
            
            console.log( 'Jobs To Submit: ', jobsToSubmit);
            
            if(isSubmit){
                submitJobs(simulation,jobsToSubmit,ncores,resourceURL);
            }else{
                return jobsToSubmit;
            }
            
        }
        
        var submitJobs = function(simulation,jobsToSubmit,ncores,resourceURL ){
            var scienceApp = Workbench.scienceApp();
            var simulationCreateTime = simulation.createTime();
            
            //block
            bStart();
            setTimeout(function(){
                var ajaxData = Liferay.Util.ns(
                        Workbench.namespace(),
                        {
                           command: 'SUBMIT_JOBS',
                           simulationUuid: simulation.uuid(),
                           simulationTime: simulationCreateTime,
                           scienceAppName: scienceApp.name(),
                           scienceAppVersion: scienceApp.version(),
                           ncores: ncores,
                           jobs: JSON.stringify( jobsToSubmit )
                        });
            
                $.ajax({
                    url : resourceURL,
                    type: 'post',
                    dataType: 'json',
                    data : ajaxData,
                    success : function(submittedJob){
                        console.log('[SUCCESS] submit job : '+submittedJob);
                        var data = {
                            simulationUuid: simulation.uuid(),
                            jobUuid: submittedJob.jobUuid,
                            tempJobUuid: submittedJob.tempJobUuid,
                            jobSubmitCnt: submittedJob.jobSubmitCnt,
                            status: true
                        };

                        bEnd();
                        
                        fireSubmitJobResult(data);
                    },
                    error:function(jqXHR, textStatus, errorThrown){
                        bEnd();
                        fireSubmitJobResult({status:false});
                    }
                });
            },500);
            
            setTimeout(function(){
                bEnd()
            },1000*7);
        };
        
        var blockModule = function ( job ){
        	var scienceApp = Workbench.scienceApp();
        	var inputPorts = scienceApp.inputPorts();
            var logPorts = scienceApp.logPorts();
            var outputPorts = scienceApp.outputPorts();
            
            /*Input Port Check*/
            for(var portName in inputPorts ){
            	var portlets = Workbench.getPortlets( portName );
            	if(Workbench.isBlockInputPort(portName)){
            		fireBlockPortEvent(portName,true);
            	}else{
            		fireBlockPortEvent(portName,isBlockValid( OSP.Enumeration.PortType.INPUT, job.status()));
            	}
            }
            
            /*Log Port Check*/
            for(var portName in logPorts ){
            	var portlets = Workbench.getPortlets( portName );
            	if(job.status()===OSP.Enumeration.JobStatus.FAILED){
            		fireBlockPortEvent(portName,isBlockValid( OSP.Enumeration.PortType.LOG, job.status()),true);
            	}else{
            		fireBlockPortEvent(portName,isBlockValid( OSP.Enumeration.PortType.LOG, job.status()),false);
            	}
            	
            }
            
            /*OUT Port Check*/
            for(var portName in outputPorts ){
            	var portlets = Workbench.getPortlets( portName );
            	if(job.status()===OSP.Enumeration.JobStatus.FAILED){
            		fireBlockPortEvent(portName,isBlockValid( OSP.Enumeration.PortType.OUTPUT, job.status()),true);
            	}else{
            		fireBlockPortEvent(portName,isBlockValid( OSP.Enumeration.PortType.OUTPUT, job.status()),false);
            	}
            }
            
            
        }
        
        var fireBlockPortEvent = function(portName,isBlock,isError){
        	var portlets = Workbench.getPortlets( portName );
        	var data = {
                    isBlock: isBlock
        	};
        	
        	if(typeof isError != 'undefined'){data.isError=isError;}
        	
        	for(var index in portlets ){
        		var portlet = portlets[index];
        		console.log('OSP_DISABLE_CONTROLLS: ['+portlet.instanceId()+', '+new Date()+']', data);
        		fire( OSP.Event.OSP_DISABLE_CONTROLLS, portlet.instanceId(), data);
        	}
        }
        
        var loadJobData = function ( job ){
            var scienceApp = Workbench.scienceApp();
            var inputPorts = scienceApp.inputPorts();
            var outputPorts = scienceApp.outputPorts();
            var logPorts = scienceApp.logPorts();
            
            resetPortlets( job, inputPorts, OSP.Enumeration.PortType.INPUT );
            resetPortlets( job, logPorts, OSP.Enumeration.PortType.LOG );
            resetPortlets( job, outputPorts, OSP.Enumeration.PortType.OUTPUT );
        }

        var resetPortlets = function( job, ports, portType ){
            var layout = Workbench.layout();
            var fireLoadOutputData = function( ports, resultFolder ){
                for( var portName in ports ){
                    var portlets = layout.getPortlets( portName );
                    var port = ports[portName];
                    
                    var portData = port.outputData();
                    var inputData = new OSP.InputData();
                    inputData.type( portData.type() );
                    
                    var parentPath = OSP.Util.mergePath( resultFolder, portData.parent() );
                    inputData.parent( parentPath );
                    inputData.name( portData.name() );
                    inputData.relative( true );
                    for( var index in portlets ){
                        var portlet = portlets[index];
                        fire( OSP.Event.OSP_LOAD_DATA, portlet.instanceId(), OSP.Util.toJSON( inputData ) );
                    }
                }
            };
            
            switch( portType ){
                case OSP.Enumeration.PortType.INPUT:
                    for( var portName in ports ){
                        var portlets = layout.getPortlets( portName );
                        var inputData = job.inputData( portName );
                        
                        for( var index in portlets ){
                            var portlet = portlets[index];
                            if( !inputData ){
                                fire( OSP.Event.OSP_INITIALIZE, portlet.instanceId(), {} );
                            }
                            else{
                                fire( OSP.Event.OSP_LOAD_DATA, portlet.instanceId(), OSP.Util.toJSON( inputData ) );
                            }
                        }
                    }
                    break;
                case OSP.Enumeration.PortType.LOG:
                    var isLogValid = isValid( OSP.Enumeration.PortType.LOG, job.status() );
                    if( isLogValid ){
                        var simulation = Workbench.workingSimulation();
                        var resultFolder = simulation.getJobOutputFolder(job);
                        
                        fireLoadOutputData( ports, resultFolder );
                    }
                    else{
                        fireShowJobStatus( {} );
                        initializeAllLogPortlets();
                    }
                    break;
                case OSP.Enumeration.PortType.OUTPUT:
                    var isOutputValid = isValid( OSP.Enumeration.PortType.OUTPUT, job.status() );
                    if( isOutputValid ){
                        var simulation = Workbench.workingSimulation();
                        var resultFolder = simulation.getJobOutputFolder(job);
                        
                        fireLoadOutputData( ports, resultFolder );
                    }
                    else{
                        fireShowJobStatus( {} );
                        initializeAllOutputPortlets();
                    }
                    
                    break;
                default:
                    console.log('[ERROR] Unknown port type - resetPortlets(): '+portType);
            }
        };

        var saveInputs = function( 
                                scienceAppName,
                                scienceAppVersion,
                                simulationTime,
                                jobNumber,
                                portName,
                                content,
                                resourceURL){
            var fileInfo;
            $.ajax({
                url: resourceURL,
                type:'post',
                dataType: 'json',
                async: false,
                data: Liferay.Util.ns(
                                      Workbench.namespace(),
                                      {
                                          command: 'SAVE_AS_INPUT',
                                          scienceAppName: scienceAppName,
                                          scienceAppVersion: scienceAppVersion,
                                          simulationTime: simulationTime.toJSON().replace(/:/ig, '-'),
                                          jobNumber: jobNumber,
                                          portName: portName,
                                          content: content
                                      }),
                success: function( result ){
                    fileInfo = result;
                },
                error: function( data, e ){
                    console.log('[ERROR] Ajax to uploadFile');
                }
            });

            return fileInfo;
        };

        var deleteJob = function( portletId, simulationUuid, jobUuid, resourceURL ){
            var data = Liferay.Util.ns(
                                       Workbench.namespace(),
                                       {
                                           command: 'DELETE_JOB',
                                           simulationUuid: simulationUuid,
                                           jobUuid: jobUuid
                                       });
            
            $.ajax({
                type: 'POST',
                url: resourceURL, 
                async : false,
                data  : data,
                success: function(result ) {
                    var data = {
                            jobUuid: jobUuid,
                            simulationUuid: simulationUuid,
                            status:true
                    };
                    fireDeleteSimulationJobResult(portletId,data);
                },
                error:function(data,e){
                    console.log(data);
                    console.log('AJAX ERROR-->'+e);
                    var data = {
                            jobUuid: jobUuid,
                            status:false
                    };
                    
                    fireDeleteSimulationJobResult(portletId,data);
                }
            });
        };

        var setJobInputData = function( portName, inputData ){
            setTimeout(
                    function(){
                        var simulation = Workbench.workingSimulation();
                        if( !simulation )   setJobInputData( portName, inputData );
                        else{
                            var job = simulation.workingJob();
                            if( !job )  setJobInputData( portName, inputData );
                            else{
                                job.inputData( portName, inputData );
                            }
                        }
                    },
                    10
            );
        };

        var submitUpload = function( uploadFile, targetFolder, fileName, resourceURL ){
                
            var formData = new FormData();
            formData.append(Workbench.namespace()+'uploadFile', uploadFile);
            formData.append(Workbench.namespace()+'command', 'UPLOAD');
            formData.append(Workbench.namespace()+'targetFolder', targetFolder);
            formData.append(Workbench.namespace()+'fileName', fileName);

            $.ajax({
                url : resourceURL,
                type : 'POST',
                data : formData,
                processData: false,  // tell jQuery not to process the data
                contentType: false,  // tell jQuery not to set contentType
                success : function(data) {
                    alert( 'Upload Succeded: ', JSON.stringify(data));
                }
            });
        };
        
        Workbench.layouts = function( layouts ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.LAYOUTS, arguments));
        };
        
        Workbench.layout = function( layout ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.LAYOUT, arguments));
        };
        
        Workbench.workingSimulation = function( simulation ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.WORKING_SIMULATION, arguments));
        };
        
        Workbench.simulations = function( simulations ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.SIMULATIONS, arguments));
        };
        
        Workbench.addSimulation = function( simulation ){
            var simulations = Workbench.simulations();
            if( !simulations ){
                simulations = {};
                Workbench.simulations( simulations );
            }
            
            simulations[simulation.uuid()] = simulation;
            
            return simulations;
        };
        
        Workbench.removeSimulation = function( simulationUuid ){
            var simulations = Workbench.simulations();
            if( !simulations )      return false;
            
            if( simulationUuid === this.workingSimulation().uuid() )
                delete Workbench[OSP.Constants.WORKING_SIMULATION];
            
            delete simulations[simulationUuid];
        };
        
        Workbench.cleanSimulations = function(){
            return P.removeProperty(OSP.Constants.SIMULATIONS);
        };
        
        Workbench.getSimulation = function( simulationUuid ){
            var simulations = Workbench.simulations();
            if( !simulations )      return false;
            
            return simulations[simulationUuid];
        };
        
        Workbench.countSimulations = function(){
            var simulations = Workbench.simulations();
            if( !simulations )  return 0;
            
            return simulations.length;
        }
        
        Workbench.newSimulation = function( jsonSimulation ){
            return  new OSP.Simulation( jsonSimulation );
        };
        
        Workbench.scienceApp = function( scienceApp ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.SCIENCE_APP, arguments));
        };
        
        Workbench.type = function( type ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.TYPE, arguments));
        };
        
        Workbench.id = function( id ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.ID, arguments));
        };
        
        Workbench.namespace = function( namespace ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.NAMESPACE, arguments));
        };
        
        Workbench.classId = function( classId ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.CLASS_ID, arguments));
        };
        
        Workbench.isFlowLayout = function( isFlowLayout ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.IS_FLOW_LAYOUT, arguments));
        };
        
        Workbench.customId = function( customId ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.CUSTOM_ID, arguments));
        };
        
        Workbench.redirectName = function( redirectName ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.REDIRECT_NAME, arguments));
        };
        
        Workbench.redirectURL = function( redirectURL ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.REDIRECT_URL, arguments));
        };
        
        Workbench.blockInputPorts = function( blockInputPorts ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.BLOCK_INPUT_PORTS, arguments));
        };
        
        Workbench.isBlockInputPort = function(portName){
        	var blockPorts = Workbench.blockInputPorts();
        	if(!blockPorts){return false;}
        	if(blockPorts===''){return false;}
        	
        	var arrayBlockPorts = blockPorts.split(',');
        	for(var index in arrayBlockPorts){
        		var blockPortName = arrayBlockPorts[index];
        		if(blockPortName===portName){
        			return true;
        		}else{
        			return false;
        		}
        	}
        };
        
        /*Workbench Layout Resize Event - GPLUS - 20181004*/
        Workbench.resizeLayout = function(namespace){
        	var workbenchLayouts = Workbench.layouts();
        	if( !workbenchLayouts )       return false;
        	
        	var layouts = workbenchLayouts.getLayouts();
        	for( var index in layouts ){
        		var layout = layouts[index];
        		var layoutName = layout[OSP.Constants.LAYOUT_NAME];
        		
        		var columns = layout.columns();
        		if( !columns )  return false;
        		
        		/*Layout*/
        		for( var index in columns ){
        			var column = columns[index];
        			
        			if(column.width()){
        				var layoutDomId = namespace+column.id();
        				var dom = document.getElementById(layoutDomId);
        				if(dom!= null){
        					var setWidth = dom.getAttribute('set-width');
        					if(setWidth!=null&&setWidth=="false"){
        						var setWidthId = dom.getAttribute('set-width-id');
        						var setDom = document.getElementById(setWidthId)
        						if(setDom!= null){
        							setDom.style.width = column.width();
        						}
        					}else{
        						dom.style.width = column.width();
        					}
        				}
        			}
        			
        			if(column.height()){
        				var layoutDomId = 'row-'+namespace+column.id();
        				var dom = document.getElementById(layoutDomId);
        				if(dom!= null){dom.style.height = column.height();}
        			}
        		}
        		
        		/*devider*/
        		var deviders = layout.deviders();
        		if(deviders){
        			for( var index in deviders ){
        				var devider = deviders[index];
        				var deviderDomId = namespace+layoutName+'_'+devider.id();
        				var dom = document.getElementById(deviderDomId);
        				if(devider.left()&&dom!= null){
        					dom.style.left = devider.left();
        				}
        				
        				if(devider.top()&&dom!= null){
        					dom.style.top = devider.top();
        				}
        			}
        		}
        	}
        };
        
        Workbench.loadPortlets = function( windowState ){
        	var layout = Workbench.layout();
        	if( !layout )       return false;
        		
        	layout.loadPortlets( Workbench.id(), true, windowState, handShakeCallback );
        };
        
        Workbench.getPortlet = function( portletId ){
        	var layout = Workbench.layout();
        	if( !layout )       return false;
        	
        	return layout.getPortlet( portletId);
        };
        
        Workbench.getPortlets = function( portName ){
            var layout = Workbench.layout();
            if( !layout )       return false;
            
            return layout.getPortlets( portName );
        };
        
        Workbench.registerEvents = function( portletId, events ){
            var layout = Workbench.layout();
            if( !layout )       return false;
            
            var portlet = layout.getPortlet( portletId );
            return portlet.events( events );
        };
        
        Workbench.getWorkingJobInputs = function(){
            var job = Workbench.workingJob();
            return job.inputs();
        };
        
        Workbench.simulationStatus = function( simulationUuid, status ){
            var simulation = Workbench.getSimulation(simulationUuid);
            
            switch( arguments.length ){
            case 1:
                return simulation.status();
            case 2:
                return simulation.status( status );
            default:
                console.log('[ERROR] Arguments mis-match.');
                return false;
            }
        };
        
        
        Workbench.simulationMonitorPortlet = function ( monitorId ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.SIMULATION_MONITOR_PORTLET, arguments));
        };
        
        Workbench.jobMonitorPortlet = function( monitorId ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.JOB_MONITOR_PORTLET, arguments));
        };
        
        Workbench.dashboardPortlet = function( dashboardId ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.DASHBOARD_PORTLET, arguments));
        };
        
        Workbench.jobStatusPortlet = function( jobStatusPortletId ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.JOB_STATUS_PORTLET, arguments));
        };
        
        Workbench.scienceAppInfoPortlet = function( portletId ){
            return Workbench.property.apply(Workbench, OSP.Util.addFirstArgument(OSP.Constants.SCIENCE_APP_INFO_PORTLET, arguments));
        };
        
        Workbench.print = function( msg ){
            console.log( '***** '+msg+' *****');
            console.log( Workbench);
        };
        
        Workbench.namespace( namespace );
        
        Workbench.handleRegisterEvents = function( portletId, portletType, events ){
            switch( portletType ){
                case OSP.Enumeration.PortType.DASHBOARD:
                    Workbench.dashboardPortlet( portletId );
                    break;
                case OSP.Enumeration.PortType.SIMULATION_MONITOR:
                    Workbench.simulationMonitorPortlet( portletId );
                    break;
                case OSP.Enumeration.PortType.JOB_MONITOR:
                    Workbench.jobMonitorPortlet( portletId );
                    break;
                case OSP.Enumeration.PortType.JOB_STATUS:
                    Workbench.jobStatusPorltet( portletId );
                    break;
                case OSP.Enumeration.PortType.APP_INFO:
                    Workbench.scienceAppInfoPortlet( portletId );
                    break;
            }
            
            if( Workbench.registerEvents( portletId, events ))
                fire( OSP.Event.OSP_EVENTS_REGISTERED, portletId, events );
        };
        
        Workbench.handleRequestSampleContent = function( portletId, resourceURL ){
            var scienceApp = Workbench.scienceApp();
            var portlet = Workbench.getPortlet(portletId);
            var port = scienceApp.getPort( portlet.portName() );
            var dataType = port.dataType();
            
            var sample = port.sample();
            var dlEntryId = 0;
            var command;
            var ajaxData;
            if( sample ){
                ajaxData = Liferay.Util.ns(
                                       Workbench.namespace(),
                                       {
                                            command: 'READ_DLENTRY',
                                            dlEntryId: sample.dlEntryId(),
                                            dataTypeName: dataType.name,
                                            dataTypeVersion: dataType.version
                                       });
            }
            else{
                ajaxData = Liferay.Util.ns(
                                       Workbench.namespace(),
                                       {
                                            command: 'READ_DATATYPE_SAMPLE',
                                            dataTypeName: dataType.name,
                                            dataTypeVersion: dataType.version
                                       });
            }
            
            $.ajax({
                url: resourceURL,
                type:'POST',
                async: false,
                dataType: 'json',
                data: ajaxData,
                success:function(result){
                    if( result.error ){
                        alert( result.error );
                        return;
                    }
                    
                    var contentType = result.contentType;
                    
                    var inputData = new OSP.InputData();
                    inputData.type( contentType);
                    inputData.order( port.order() );
                    inputData.portName( port.name() );
                    inputData.name( result.fileName );
                    
                    switch( contentType ){
                        case 'fileContent':
                            inputData.context( result.fileContent );
                            break;
                        case 'structuredData':
                            var ospDataType = new OSP.DataType();
                            ospDataType.deserializeStructure( JSON.parse(result.dataStructure) );
                            if( result.fileContent ){
                                ospDataType.loadStructure( result.fileContent );
                            }
                            inputData.context( ospDataType.structure() );
                            break;
                        default:
                            console.log('[ERROR] Wrong sample data type.'+contentType);
                            return;
                    }
                    
                    fire( 
                            OSP.Event.OSP_LOAD_DATA, 
                            portletId, 
                            OSP.Util.toJSON(inputData) );
                    
                    
                    fireDataChanged( 
                                    portletId,
                                    OSP.Util.toJSON(inputData) );
                },
                error: function(){
                    alert('[ERROR] AJAX FAILED during READ_DATATYPE_SAMPLE: '+sample.dlEntryId()+
                          '\nPlease contact site manager.');
                }
            });
        };
        
        Workbench.handleSampleSelected = function( portletId, resourceURL ){
            var scienceApp = Workbench.scienceApp();
            var portlet = Workbench.getPortlet(portletId);
            var inputPort = scienceApp.inputPort( portlet.portName() );
            var portDataType = inputPort.dataType();
            
            var inputData = new OSP.InputData();
            inputData.portName( inputPort.name() );
            inputData.order( inputPort.order() );
            inputData.type( OSP.Enumeration.PathType.DLENTRY_ID );
            inputData.dirty( true );

            var sample = inputPort.sample();
            
            if( sample ){
                inputData.dlEntryId( sample.dlEntryId() );
                fireDataChanged( portletId, OSP.Util.toJSON( inputData ) );
            }
            else{
                var ajaxData = Liferay.Util.ns(
                                           Workbench.namespace(),
                                           {
                                                command: 'GET_DATATYPE_SAMPLE',
                                                dataTypeName: portDataType.name,
                                                dataTypeVersion: portDataType.version
                                           });
                $.ajax({
                    url: resourceURL,
                    type: 'post',
                    dataType: 'json',
                    data: ajaxData,
                    success: function( result ){
                        console.log( 'SAMPLE_SELECTED RESULT: ', result);
                        inputData.dlEntryId( result.dlEntryId );
                        fireDataChanged( portletId, OSP.Util.toJSON( inputData ) );
                    },
                    error: function( data, e ){
                        console.log( '[ERROR] Getting data type sample: '+ portDataType.name );
                    }
                });
            }
        };
        
        Workbench.handleReadStructuredDataFile = function( portletId, inputData, resourceURL ){
            var scienceApp = Workbench.scienceApp();
            var portlet = Workbench.getPortlet(portletId);
            var inputPort = scienceApp.inputPort( portlet.portName() );
            var portDataType = inputPort.dataType();
            
            var repositoryType = inputData.repositoryType();
            
            var ajaxData = Liferay.Util.ns(
                                           Workbench.namespace(),
                                           {
                                               command: 'GET_DATA_STRUCTURE_WITH_DATA',
                                                dataTypeName: portDataType.name,
                                                dataTypeVersion: portDataType.version,
                                                parentPath: inputData.parent(),
                                                fileName: inputData.name(),
                                                repositoryType: repositoryType
                                           });
            $.ajax({
                url: resourceURL,
                type: 'post',
                dataType: 'json',
                data: ajaxData,
                success: function( result ){
                    console.log( 'OSP_READ_STRUCTURED_DATA_FILE', result);
                    var dataType = new OSP.DataType();
                    dataType.deserializeStructure(JSON.parse(result.dataStructure));
                    dataType.loadStructure( result.structuredData );
                    
                    var data = {
                                type_: OSP.Enumeration.PathType.STRUCTURED_DATA,
                                context_: OSP.Util.toJSON( dataType.structure() )
                    };
                    
                    fire( OSP.Event.OSP_LOAD_DATA, portletId, data );
                },
                error: function( data, e ){
                    console.log( '[ERROR] Getting data type sample: '+ portDataType.name );
                }
            });
        };
        
        Workbench.handleRequestPortInfo = function( portletId, resourceURL ){
            setTimeout(
                    function(){
                        var simulation = Workbench.workingSimulation();
                        if( !simulation ){
                            Workbench.handleRequestPortInfo( portletId, resourceURL );
                        }
                        else{
                            var job = simulation.workingJob();
                            if( !job ){
                                Workbench.handleRequestPortInfo( portletId, resourceURL );
                            }
                            else{
                                Workbench.evaluatePortsStatus();
                                
                                var data = {
                                            scienceApp: Workbench.scienceApp()
                                };
                                
                                fire( OSP.Event.OSP_RESPONSE_PORT_INFO, portletId, data );
                            }
                        }
                    }, 
                    10
                );
        };
        
        Workbench.handleRequestMonitorInfo = function( portletId ){
            var data = {
                        scienceAppId: Workbench.scienceApp().id(),
                        classId: Workbench.classId(),
                        customId: Workbench.customId()
                    };
                
            fire( OSP.Event.OSP_RESPONSE_MONITOR_INFO, portletId, data);
        };
        
        
        Workbench.handleRequestAppInfo = function( portletId ){
            var data = {
                        scienceApp: Workbench.scienceApp(),
                        workbenchId: Workbench.id(),
                        workbenchRedirectURL: Workbench.redirectURL(),
                        workbenchRedirectName: Workbench.redirectName()
                    };
                
            fire( OSP.Event.OSP_RESPONSE_APP_INFO, portletId, data);
        };
        
        Workbench.handleRequestSimulationUuid = function( portletId ){
            setTimeout( 
                    function(){
                        var simulation = Workbench.workingSimulation();
                        if( !simulation ){
                            Workbench.handleRequestSimulationUuid(portletId);
                        }
                        else{
                            var data = {
                                        simulationUuid: simulation.uuid(),
                                };
                            
                            fire(OSP.Event.OSP_RESPONSE_SIMULATION_UUID, portletId, data);
                        }
                    }, 
                    10
            );
        };
        
        Workbench.handlePortSelected = function( portName, portletInstanceId ){
            console.log( 'handlePortSelected(): ', portName, portletInstanceId);
            setTimeout(
                    function(){
                        var simulation = Workbench.workingSimulation();
                        if( !simulation ){
                            Workbench.handlePortSelected( portName, portletInstanceId );
                        }
                        else{
                            var job = simulation.workingJob();
                            if( !job ){
                                Workbench.handlePortSelected( portName, portletInstanceId );
                            }
                            else{
                                if( portletInstanceId )
                                    Workbench.switchPortlet( portletInstanceId );
                                else
                                    Workbench.switchPortlets( portName );
                            }
                        }
                    },
                   10
            );
        };
        
        Workbench.handleDataChanged = function( portletId, data){
            console.log( 'handleDataChanged(): ',portletId, data);
            
            setTimeout(
                function(){
                    var simulation = Workbench.workingSimulation();
                    var job = simulation.workingJob();
                    
                    var portlet = Workbench.getPortlet( portletId );
                    var portName = portlet.portName();
                    if( !portName ){
                        console.log( "[Warning] Received OSP.Event.OSP_DATA_CHANGED from a portlet without port name: "+e.portletId);
                        return;
                    }
                    
                    // Check the event coming from input ports
                    var scienceApp = Workbench.scienceApp();
                    var port = scienceApp.inputPort( portName );
                    if( !port ){
                        console.log('[Warning] Not an input port: '+portName);
                        return;
                    }
                    
                    console.log('Data Changed data: ', data);
                    var changedData = new OSP.InputData( data );
                    changedData.portName( port.name() );
                    changedData.order(port.order() );
                    changedData.relative( true );
                    changedData.dirty( true );
                        
                    if( job.isSubmit() ){
                        $.confirm({
                            boxWidth: '30%',
                            useBootstrap: false,
                            title: 'Confirm!',
                            content: '<p>Submitted job data changed.<br>Would you like to copy the job with changed data?</p>',
                            buttons: {
                                confirm: function () {
                                    var inputs = job.copyInputs();
                                    for( var index in inputs ){
                                        var input = inputs[index];
                                        if( input.portName() === changedData.portName() ){
                                            inputs[index] = changedData;
                                            break;
                                        }
                                    }
                                    
                                    console.log("Copy inputs: ", inputs);
                                    console.log("Passed InputData: ", changedData);
                                    var result = getJobInitDataFromInputData(job,inputs);
//                                    fireSimulationModal(JSON.stringify(changeInputs));
                                    fireSimulationModal(result);
                                },
                                cancel: function () {
                                    
                                }
                            }
                        });
                    }
                    else{
                        job.inputData( portName, changedData );
//                        console.log(JSON.stringify(job));
                        firePortStatusChanged( portName, OSP.Enumeration.PortStatus.READY );
                    }
                },
               10
            );
        };
        
        /*Job initData Converter From InputData */
        var getJobInitDataFromInputData = function(copyJob,inputs){
//        	console.log(copyJob);
//        	var copyJob = simulation.workingJob();
        	for( var index in inputs ){
        		var inputData = inputs[index];
        		if(inputData){
        			if( inputData.type() === OSP.Enumeration.PathType.STRUCTURED_DATA ){
        				var dataType = new OSP.DataType();
        				dataType.deserializeStructure(inputData.context());
        				var dataStructure = dataType.structure(); 
						var fileContents = dataStructure.activeParameterFormattedInputs();
						
						var data = new OSP.InputData();
						data.portName( inputData.portName() );
						data.order( inputData.order() );
						data.type( OSP.Enumeration.PathType.FILE_CONTENT );
						data.context( fileContents[0].join('') );
						
						copyJob.inputData(inputData.portName(), data );
        			}else{
        				copyJob.inputData(inputData.portName(),inputData);
        			}
        		}else{
        			return false;
        		}
        	}
        	
        	return true;
//        	return copyJob.inputs();
//        	console.log(JSON.stringify(copyJob.inputs()));
//        	console.log(copyJob.inputs());
        };

        
        Workbench.handleCreateSimulation = function(portletId, title, jobTitle, jobInitData, resourceURL ){
            createSimulation(portletId, title, jobTitle, jobInitData, resourceURL );
        };
        
        
        Workbench.handleSaveSimulation = function( portletId, resourceURL ){
            var simulation = Workbench.workingSimulation();
            if( simulation.checkDirty() )
                saveSimulation( portletId, Workbench.workingSimulation(), resourceURL );
            else
            $.alert({
                title: 'Alert!',
                content: 'No changes to be saved: '+simulation.title()
            });
        };
        
        Workbench.handleDeleteSimulation = function( portletId, simulationUuid, resourceURL ){
            deleteSimulation( portletId, simulationUuid, resourceURL );
        };
        
        Workbench.handleSimulationSelected = function( simulationUuid, $confirmDialog, resourceURL ){
            var simulation = Workbench.getSimulation( simulationUuid );
            if( !simulation ){
                loadSimulation( simulationUuid, resourceURL );
            }
            else{
                var prevSimulation = Workbench.workingSimulation();
                if( prevSimulation.uuid() === simulationUuid )
                    return;
                
                if( prevSimulation.checkDirty() ){
                    $confirmDialog.dialog({
                        resizable: false,
                        height: "auto",
                        title:'Make sure to save...',
                        width: 400,
                        modal: true,
                        buttons: {
                            'YES': function() {
                                    $( this ).dialog( "destroy" );
                                    saveSimulation( prevSimulation );
                            },
                            'NO': function() {
                                $( this ).dialog( "destroy" );
                            }
                        }
                    });
                }

                Workbench.workingSimulation( simulation );
                
                var data = {
                                simulationUuid: simulationUuid
                            };
                fireRequestWorkingJobInfo( data ); 
            }
        };
        
        Workbench.handleSubmitJob = function(resourceURL){
            var scienceApp = Workbench.scienceApp();
            var simulation = Workbench.workingSimulation();
            var job = simulation.workingJob();
            
            Workbench.handleJobRequiredValidation(scienceApp,job);
            
            if( scienceApp.runType() === 'Sequential' ){
                jobsToSubmitGetParameters(simulation,job, true, resourceURL );
            }else{
                submitMPJobs(job,resourceURL);
            }
        }; 
        
        
        Workbench.handleJobRequiredValidation = function(scienceApp,job){
        	var array = scienceApp.getMandatoryInputPortNames();
        	if(array.length ==0){
        		return true;
        	}else{
        		for(var property in array ){
        			var inputData = job.inputData(array[property]);
        			if(!inputData){
        				$.alert(Liferay.Language.get('edison-this-field-is-required',[array[property]]));
        				throw "stop"; 
        			}
        		}
        	}
        };
        
        Workbench.handleJobSelected = function(simulationUuid, jobUuid,resourceURL ){
            var searchSimulation = false;
            //init
            if(!Workbench.workingSimulation()){
                searchSimulation = true;
            }else{
                //simulation exist check
                if(Workbench.getSimulation(simulationUuid)){
                    Workbench.workingSimulation(Workbench.getSimulation(simulationUuid));
                }else{
                    searchSimulation = true;
                }
                    
            }
            
            if(searchSimulation){
                var data = Liferay.Util.ns(
                    Workbench.namespace(),
                    {
                       command: 'LOAD_SIMULATION',
                       simulationUuid: simulationUuid
                    });

                    $.ajax({
                        type: 'POST',
                        url: resourceURL, 
                        async : false,
                        data  : data,
                        dataType : 'json',
                        success: function(jsonSimulation) {
                            var simulation = new OSP.Simulation( jsonSimulation );
                            var scienceApp = Workbench.scienceApp();
                            simulation.runType( scienceApp.runType() );
                            Workbench.addSimulation( simulation );
                            Workbench.workingSimulation( simulation );
                        },
                        error:function(data,e){
                            if(jqXHR.responseText !== ''){
                                alert("LOAD_SIMULATION-->"+textStatus+": "+jqXHR.responseText);
                            }else{
                                alert("LOAD_SIMULATION-->"+textStatus+": "+errorThrown);
                            }
                        }
                    });
            }
            
            var searchSimulationJob = false;
            var simulation = Workbench.workingSimulation();
            var job = simulation.getJob( jobUuid );
            
            var jobSearch = false;
            if(!job){
                jobSearch = true;
            }else{
                if(job.isSubmit()){
                    jobSearch = true;
                }
            }
            
            if(jobSearch){
                $.ajax({
                    url : resourceURL,
                    type : 'POST',
                    async : false,
                    dataType: 'json',
                    data : Liferay.Util.ns(
                                           Workbench.namespace(),
                                           {
                                               command: 'LOAD_JOB',
                                               simulationUuid: simulationUuid,
                                               jobUuid: jobUuid
                                           }),
                    success : function( result ) {
                        var jsonJob = result.job_;
                        if(result.inputs_){
                            jsonJob.inputs_ = JSON.parse(result.inputs_);
                        }
                        
                        console.log(jsonJob);
                        job = simulation.newJob( jsonJob );
                        
                        if( job.isSubmit() ){
                            job.dirty( false );
                        }
                        
                        simulation.addJob( job );
                    },error:function(jqXHR, textStatus, errorThrown){
                        if(jqXHR.responseText !== ''){
                            alert(textStatus+": "+jqXHR.responseText);
                        }else{
                            alert(textStatus+": "+errorThrown);
                        }
                    }
                });
            }
            
            //default logic
            simulation.workingJob( job );
            
            loadJobData( job );
            
            /*Block Editor,Analyzer BL*/
            blockModule( job );
            
            var statusData = {
                    simulationTitle: simulation.title(),
                    jobTitle: job.title(),
                    simulationUuid: simulation.uuid(),
                    jobUuid: job.uuid(),
                    jobStatus: job.status(),
                    isEdit: job.isEdit()
            };
            
            fireRefreshJobStatus(statusData);
        };
        
        Workbench.handleRequestJobUuid = function( targetPortlet ){
            setTimeout(
                    function(){
                        var simulation = Workbench.workingSimulation();
                        if( !simulation ){
                            Workbench.handleRequestJobUuid( targetPortlet );
                        }
                        else{
                            var workingJob = simulation.workingJob();
                            if( !workingJob ){
                                Workbench.handleRequestJobUuid( targetPortlet );
                            }
                            else{
                                var data = {
                                                        simulationUuid: simulation.uuid(),
                                                        jobUuid: workingJob.uuid()
                                };
                                
                                fire( OSP.Event.OSP_RESPONSE_JOB_UUID, targetPortlet, data );
                            }
                        }
                    },
                    10
            );
        };
        
        Workbench.handleShowJobStatus = function(){
            Workbench.switchPortlet(Workbench.jobStatusPortlet());
        };
        
        Workbench.handleDeleteJob = function( portletId, simulationUuid, jobUuid, resourceURL){
            deleteJob( portletId, simulationUuid, jobUuid, resourceURL );
        };

        Workbench.handleJobStatusChanged = function( jobUuid, status ){
            var simulation = Workbench.workingSimulation();
            var job = simulation.getJob( jobUuid );
            job.status( OSP.Util.convertJobStatus(Number(status)) );

            var workingJob = simulation.workingJob();
            if( workingJob.uuid() !== jobUuid ){
                return;
            }

            var statusData = {
                    simulationTitle: simulation.title(),
                    jobTitle: job.title(),
                    simulationUuid: simulation.uuid(),
                    jobUuid: job.uuid(),
                    jobStatus: job.status(),
                    isEdit: job.isEdit()
            };
            
            fireRefreshJobStatus(statusData);
            
            var scienceApp = Workbench.scienceApp();
            var logPorts = scienceApp.logPorts();
            var outputPorts = scienceApp.outputPorts();

            var isLogValid = isValid( OSP.Enumeration.PortType.LOG, workingJob.status() );
            var isOutputValid = isValid( OSP.Enumeration.PortType.OUTPUT, workingJob.status() );
            
            var ports;
            if( isOutputValid ){
                for( var portName in outputPorts ){
                    var port = outputPorts[portName];
                    var outputData = port.outputData();
                    outputData.parent( OSP.Util.mergePath( simulation.getJobOutputFolder(job), outputData.parent() ) );
                    var portlets = Workbench.getPortlets( portName );
                    for( var index in portlets ){
                        var portlet = portlets[index];
                        console.log('Ooutput Data: ', port.outputData());
                        fire( OSP.Event.OSP_LOAD_DATA, portlet.instanceId(), OSP.Util.toJSON(outputData) );
                    }

//                    firePortStatusChanged( portName, OSP.Enumeration.PortStatus.OUTPUT_VALID );
                }
            }
            
            if( isLogValid ){
                for( var portName in logPorts ){
                    var port = logPorts[portName];
                    var outputData = port.outputData();
                    outputData.parent( OSP.Util.mergePath( simulation.getJobOutputFolder(job), outputData.parent() ) );
                    var portlets = Workbench.getPortlets( portName );
                    for( var index in portlets ){
                        var portlet = portlets[index];
                        fire( OSP.Event.OSP_LOAD_DATA, portlet.instanceId(), OSP.Util.toJSON(outputData) );
                    }

//                    firePortStatusChanged( portName, OSP.Enumeration.PortStatus.LOG_VALID );
                }
            }
        };
        
        Workbench.handleRequestPath = function( targetPortlet ){
            setTimeout(
                    function(){
                        var simulation = Workbench.workingSimulation();
                        if( !simulation ){
                            Workbench.handleRequestPath( targetPortlet );
                        }
                        else{
                            var workingJob = simulation.workingJob();
                            if( !workingJob ){
                                Workbench.handleRequestPath( targetPortlet );
                            }
                            else{
                                var portlet = Workbench.getPortlet( targetPortlet );
                                var scienceApp = Workbench.scienceApp();
                                var inputPort = scienceApp.inputPort( portlet.portName() );
                                
                                var inputData = workingJob.inputData( portlet.portName() );
                                
                                console.log( "HandleRequestPath: ", workingJob );
                                if( inputData ){
                                    console.log( "HandleRequestPath: ", inputData );
                                }
                                else{
                                    console.log( "Job has No input data.....");
                                    inputData = new OSP.InputData();
                                    inputData.portName( inputPort.name() );
                                    inputData.order( inputPort.order() );
                                    inputData.type(OSP.Enumeration.PathType.FOLDER);
                                    inputData.parent( '' );
                                    inputData.name('');
                                    inputData.relative(true);

                                    setJobInputData( portlet.portName(), inputData )
                                }
                                
                                
                                fire( 
                                        OSP.Event.OSP_LOAD_DATA, 
                                        targetPortlet, 
                                        OSP.Util.toJSON(inputData) );
                            }
                        }
                    },
                    10
            );
        };

        Workbench.handleRequestOutputPath = function( targetPortlet ){
            setTimeout(
                    function(){
                        var simulation = Workbench.workingSimulation();
                        if( !simulation ){
                            Workbench.handleRequestOutputPath( targetPortlet );
                        }
                        else{
                            var workingJob = simulation.workingJob();
                            if( !workingJob ){
                                Workbench.handleRequestOutputPath( targetPortlet );
                            }
                            else{
                                var isOutputValid = isValid( OSP.Enumeration.PortType.OUTPUT, workingJob.status());
                                if( !isOutputValid ){
                                    return;
                                }
                                
                                var portlet = Workbench.getPortlet( targetPortlet );
                                var scienceApp = Workbench.scienceApp();
                                var outputPorts = scienceApp.outputPorts();
                                if( !outputPorts ){
                                    // To do: display Download portlet
                                    return;
                                }

                                var outputPort = scienceApp.getPort( portlet.portName() );
                                var portData = outputPort.outputData(); 

                                var parentPath =OSP.Util.mergePath( simulation.getJobOutputFolder(workingJob), portData.parent() );
                                
                                var inputData = new OSP.InputData();
                                inputData.type(portData.type());
                                inputData.parent( parentPath );
                                inputData.name(portData.name());
                                inputData.relative(true);
                                
                                fire( 
                                        OSP.Event.OSP_LOAD_DATA, 
                                        targetPortlet, 
                                        OSP.Util.toJSON(inputData) );
                            }
                        }
                    },
                    10
            );
        };
        
        Workbench.handleRequestDataStructure = function( portletId, resourceURL ){
            var portlet = Workbench.getPortlet( portletId );
            var portName = portlet.portName();
            
            var scienceApp = Workbench.scienceApp();
            var port = scienceApp.getPort( portlet.portName() );
            var dataType = port.dataType();
            var ajaxParam = Liferay.Util.ns(
                                Workbench.namespace(),
                                {
                                    command: 'GET_DATA_STRUCTURE',
                                    dataTypeName: dataType.name,
                                    dataTypeVersion: dataType.version
                                });
            
            $.ajax({
                type: 'POST',
                url: resourceURL, 
                async : false,
                data  : ajaxParam,
                dataType : 'json',
                success: function(jsonDataStructure) {
                    var data = {
                                type_: OSP.Enumeration.PathType.STRUCTURED_DATA,
                                context_: jsonDataStructure
                            };
                    fire( OSP.Event.OSP_LOAD_DATA, portletId, data );
                },
                error:function(data,e){
                    console.log(data);
                    console.log('REQUEST_DATA_STRUCTURE AJAX ERROR-->', e);
                }
            });
        };

        Workbench.handleRequestPortInfo = function( targetPortletId  ){
            var data = {
                scienceApp: Workbench.scienceApp()
            };
            fire( OSP.Event.OSP_RESPONSE_PORT_INFO, targetPortletId, data );
        };
        
        Workbench.handleJobDeleted = function( simulationUuid, jobUuid ){
            console.log( 'handleJobDeleted(): '+jobUuid );
            var simulation = Workbench.getSimulation( simulationUuid );
            if( !simulation ){
                return true;
            }
            
            var job = simulation.getJob( jobUuid );
            if( !job ){
                return true;
            }
            
            simulation.removeJob( jobUuid );
        };
        
        Workbench.handleRequestSpreadToPort = function( portletId, event, data ){
            var reqPortlet = Workbench.getPortlet( portletId );
            console.log( reqPortlet );
            var portlets = Workbench.getPortlets( reqPortlet.portName() );
            console.log( portlets );
            for( var index in portlets ){
                var portlet = portlets[index];
                if( portletId === portlet.instanceId() )    continue;
                
                var eventData = {
                                 portletId: Workbench.id(),
                                 targetPortlet: portlet.instanceId(),
                                 data: data
                };
                Liferay.fire( OSP.Event.OSP_LOAD_DATA, eventData);
            }

        };
        
        Workbench.handleCancelJob = function(portletId, jobUuid, resourceURL){
        	var ajaxData = Liferay.Util.ns(
			                    Workbench.namespace(),
			                    {
			                        command: 'CANCEL_JOB',
			                        jobUuid: jobUuid
			                    }
        					);
        	
        	 $.ajax({
        		  type: 'POST',
                  url: resourceURL, 
                  async : false,
                  data  : ajaxData,
                  dataType : 'json',
                  success: function() {
                	  var data = {
                              jobUuid: jobUuid,
                              status:true
                      };
                	  fireCancelSimulationJobResult(portletId,data);
                  },
                  error:function(data,e){
                      console.log(data);
                      console.log('AJAX ERROR-->'+e);
                      var data = {
                               status:false
                      };
                      fireCancelSimulationJobResult(portletId,data);
                  }
        	 });
        };
        
        Workbench.handleCreateJob = function(portletId, simulationUuid, title, initData, resourceURL){
            console.log('handleCreateJob: ', initData );
            
            var scienceApp = Workbench.scienceApp();
            
            var ajaxData = Liferay.Util.ns(
                                       Workbench.namespace(),
                                       {
                                           command: 'CREATE_JOB',
                                           simulationUuid: simulationUuid,
                                           title: title,
                                           scienceAppName: scienceApp.name(),
                                           scienceAppVersion: scienceApp.version(),
                                           initData: initData ? initData : '' 
                                       }
            );
            
            $.ajax({
                type: 'POST',
                url: resourceURL, 
                async : false,
                data  : ajaxData,
                dataType : 'json',
                success: function(jsonJob ) {
                    var data = {
                            simulationUuid: simulationUuid,
                            jobUuid: jsonJob.uuid_,
                            status:true
                    };
                    fireCreateSimulationJobResult(portletId,data);
                },
                error:function(data,e){
                    console.log(data);
                    console.log('AJAX ERROR-->'+e);
                    var data = {
                             status:false
                    };
                    fireCreateSimulationJobResult(portletId,data);
                }
            });
        };
        
        Workbench.handleSubmitSimulation = function( $inputHandler, $getCoresDialog, resourceURL ){
            var simulation = Workbench.workingSimulation();
            
            var dirtyJobs = simulation.getDirtyJobs();
            if( dirtyJobs.length < 1 ){
                console.log("No dirty jobs....");
                return;
            }
            
            if( simulation.runType() === 'Sequential' ){
                submitSimulation( simulation, resourceURL );
            }
            else{
                submitMPJobs( $inputHandler, $getCoresDialog, resourceURL );
            }
        };
        
        
        
        var handShakeCallback = function( sourceId, targetId ){
            var portlet = Workbench.getPortlet( targetId );
            var scienceApp = Workbench.scienceApp();
            var portType = scienceApp.getPortType( portlet.portName() );
            portlet.portType( portType );
            
            var eventData = {
                    portletId: sourceId,
                    targetPortlet: targetId,
            };
            
            Liferay.fire( OSP.Event.OSP_HANDSHAKE, eventData );
        };
        
        Workbench.switchPortlet = function( portletInstanceId ){
            var layout = Workbench.layout();
            var scienceApp = Workbench.scienceApp();
            
            layout.switchPortlet( 
                        portletInstanceId, 
                        Workbench.id(), 
                        true, 
                        'exclusive', 
                        handShakeCallback );

            var simulation = Workbench.workingSimulation();
            var job = simulation.workingJob();
            
            var portlet = layout.getPortlet( portletInstanceId );
            var portType = scienceApp.getPortType(portlet.portName());
            
            var inputData;
            var portData;
            switch( portType ){
                case OSP.Enumeration.PortType.INPUT:
                    inputData = job.inputData( portlet.portName() );
                    break;
                case OSP.Enumeration.PortType.OUTPUT:
                    if( isValid(OSP.Enumeration.PortType.OUTPUT, job.status() ) ){
                        var outputPort = scienceApp.outputPort( portlet.portName() );
                        portData = outputPort.outputData(); 
                    }
                    break;
                case OSP.Enumeration.PortType.LOG:
                    if( isValid(OSP.Enumeration.PortType.LOG, job.status() ) ){
                        var logPort = scienceApp.logPort( portlet.portName() );
                        portData = logPort.outputData();    
                    }
                    break;
            }
            
            if( portData ){
                var parentPath =OSP.Util.mergePath( simulation.getJobOutputFolder(job), portData.parent() );
                
                inputData = new OSP.InputData();
                inputData.type(portData.type());
                inputData.parent( parentPath );
                inputData.name(portData.name());
                inputData.relative(true);
            }
            
            if( inputData ){
                fire( OSP.Event.OSP_LOAD_DATA, portletInstanceId,  OSP.Util.toJSON( inputData ) );
            }
        };
                
        Workbench.switchPortlets = function( portName ){
            console.log('switchPortlets: '+portName);
            var portlets = Workbench.getPortlets(portName);
            console.log(portlets);
            
            for( var index in portlets ){
                var portlet = portlets[index];
                Workbench.switchPortlet( portlet.instanceId() );
            }
        };
        
    }; /* End of Workbench */
    
})(window);