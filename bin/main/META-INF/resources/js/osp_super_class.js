(function(window){
	'use strict';

	if( window.OSP ){
		if( OSP._MapObject )	return;
	}
	else
		window.OSP = {};
	
	OSP._MapObject = function(){
		var MapObject = this;
		MapObject.property = function( key, value){
			switch( arguments.length ){
				case 1:
					if( MapObject.hasOwnProperty(key) )
						return MapObject[key];
					else
						return false;
				case 2:
					MapObject[key] = value;
					return true;
				default:
					return false;
			}
		};

		MapObject.removeProperty = function( firstKey, secondKey ){
			switch( arguments.length ){
			case 1:
				delete MapObject[firstKey];
				return true;
			case 2:
				var firstObj = MapObject.property(firstKey);
				if( typeof firstObj === 'object' )
					return delete firstObj[secondKey];

				return false;
			default:
				return false;
			}
		};

		MapObject.toJsonObject = function(){
			return JSON.parse( JSON.stringify(MapObject) );
		};
		
		MapObject.arrayExist = function(arrayObject,key){
			return arrayObject.some(function(arrVal) {
				return key === arrVal;
			});
		};

		MapObject._deserialize = function( key, value ){
			if( typeof value === 'function')	return false;
			else	MapObject.property(key, value);

			return true;
		};
	}; // End of _MapObject

	OSP._OpenObject = function( jsonObject ){
		var OpenObject = this;
		OSP._MapObject.apply(OpenObject);

		OpenObject.id = function( id ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.ID, arguments) );
		};

		OpenObject.uuid = function( uuid ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.UUID, arguments) );
		};

		OpenObject.name = function( name ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.NAME, arguments) );
		};

		OpenObject.version = function( version ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.VERSION, arguments) );
		};

		OpenObject.status = function( status ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.STATUS, arguments) );
		};

		OpenObject.sample = function( samplePath ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.SAMPLE, arguments) );
		};

		OpenObject.samplePath = function( path ){
			var samplePath = OpenObject.sample();
			if( !samplePath )	return false;
			return sample.fullPath.apply( samplePath, arguments );
		};

		OpenObject.safeSample = function (){
			var sample = OpenObject.sample();
			if( !sample ){
				sample = new OSP.Path();
				OpenObject.sample( sample );
			}
			return sample;
		};

		OpenObject.setSample = function( parent, name, pathType, relative ){
			var sample = OpenObject.safeSample();
			return sample.setPath.apply( sample, arguments );
		};

		OpenObject.sampleUri = function( uri ){
			var sample = OpenObject.safeSample();
			return sample.uri.apply( sample, arguments );
		};

		OpenObject.samplePathType = function( pathType ){
			var sample = OpenObject.safeSample();
			return sample.type.apply( sample, arguments );
		};

		OpenObject.sampleParentFolderPath = function( parentPath ){
			var sample = OpenObject.safeSample();
			return sample.parent.apply( sample, arguments );
		};

		OpenObject.sampleName = function( name ){
			var sample = OpenObject.safeSample();
			return sample.name.apply( sample, arguments );
		};

		OpenObject.sampleRelative = function( relative ){
			var sample = OpenObject.safeSample();
			return sample.relative.apply( sample, arguments );
		};

		OpenObject.getSampleData = function( url, params ){

		};

		OpenObject.title = function( title ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.TITLE, arguments) );
		};

		OpenObject.localizedTitle = function( languageId, text ){
			var title = OpenObject.title();

			switch( arguemnts.length ){
				case 1:
					if( !title )	return '';
					return title[languageId];
				case 2:
					if( !title ){
						title = {};
						OpenObject.title( title );
					}
					return title[languageId] = text;
				default:
					console.log( 'localizedTitle(): argument count mismatch('+arguments.length+')');
					return false;
			}
		};

		OpenObject.removeLocalizedTitle = function( languageId ){
			var title = OpenObject.title();
			if( !title )	return true;

			return delete title[languageId];
		};

		OpenObject.toTitleXml = function( availableLanguageIds, defaultLanguageId ){
			var title = OpenObject.title();
			if( !title )	title = {};
			return OSP.Util.toLocalizedXml( title, availableLanguageIds, defaultLanguageId );
		};

		OpenObject.targetLanguage = function ( languageId ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.TARGET_LANGUAGE, arguments) );
		};

		OpenObject.description = function( description ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.DESCRIPTION, arguments) );
		};

		OpenObject.localizedDescription = function( languageId, text ){
			var description = OpenObject.description();

			switch( arguemnts.length ){
				case 1:
					if( !description )	return '';
					return description[languageId];
				case 2:
					if( !description ){
						description = {};
						OpenObject.description( description );
					}
					return description[languageId] = text;
				default:
					return false;
			}
		};

		OpenObject.removeLocalizedDescription = function( languageId ){
			var description = OpenObject.description();
			if( !description )	return true;

			return delete description[languageId];
		};

		OpenObject.toDescriptionXml = function( availableLanguageIds, defaultLanguageId ){
			var description = OpenObject.description();
			if( !description )	description = {};
			return OSP.Util.toLocalizedXml( description, availableLanguageIds, defaultLanguageId );
		};

		OpenObject.icon = function( iconPath ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.ICON, arguments) );
		};

		OpenObject.image = function( imagePath ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.IMAGE, arguments) );
		};

		OpenObject.layout = function( layout ){
			return OpenObject.property.apply( OpenObject, OSP.Util.addFirstArgument(OSP.Constants.LAYOUT, arguments) );
		};

		OpenObject.layoutTemplateId = function( templateId ){
			var layout = OpenObject.layout();
			if( !layout ){
				layout = new OSP.Layout();
				OpenObject.layout( layout );
			}
			return layout.templateId.apply ( layout, arguments );
		};

		OpenObject.layoutColumn = function( columnId, portlets ){
			var layout = OpenObject.layout();
			if( !layout )	return false;

			return layout.column.apply ( layout, arguments );
		};

		OpenObject.layoutAddPortlet = function (columnId, portlet){
			var layout = OpenObject.layout();
			if( !layout ){
				layout = new OSP.Layout();
				OpenObject.layout( layout );
			}
			return layout.addPortlet.apply ( layout, arguments );
		};

		OpenObject.layoutRemovePortlet = function( columnId, portletId ){
			var layout = OpenObject.layout();
			if( !layout )	return true;

			return layout.removePortlet.apply ( layout, arguments );
		};

		OpenObject.layoutRemoveColumn = function( columnId ){
			var layout = OpenObject.layout();
			if( !layout )	return true;

			return layout.removeColumn.apply ( layout, arguments );
		};

		OpenObject.getLayoutColumnNames = function(){
			var layout = OpenObject.layout();
			if( !layout )	return false;

			return layout.getColumnNames.apply ( layout, arguments );
		};

		OpenObject.hasLayoutPortlet = function( portletId, columnId ){
			var layout = OpenObject.layout();
			if( !layout )	return false;

			return layout.hasPortlet.apply ( layout, arguments );
		};

		OpenObject.getLayoutPortlet = function( portletId, columnId ){
			var layout = OpenObject.layout();
			if( !layout )	return false;

			return layout.getPortlet.apply ( layout, arguments );
		};

		OpenObject.deserializeLayout = function( jsonLayout ){
			OpenObject.layout( new OSP.Layout( jsonLayout ) );
		};
		
		OpenObject._deserialize = function( key, jsonObject ){
			switch( key ){
				case OSP.Constants.ID:
				case OSP.Constants.UUID:
				case OSP.Constants.NAME:
				case OSP.Constants.VERSION:
				case OSP.Constants.STATUS:
				case OSP.Constants.TARGET_LANGUAGE:
				case OSP.Constants.DESCRIPTION:
				case OSP.Constants.ICON:
				case OSP.Constants.IMAGE:
				case OSP.Constants.TITLE:
				case OSP.Constants.CREATE_TIME:
					OpenObject.property(key, jsonObject );
					break;
				case OSP.Constants.SAMPLE:
					OpenObject.property( key, new OSP.Path( jsonObject ) );
					break;
				case OSP.Constants.LAYOUT:
					OpenObject.property( key, new OSP.Layout( jsonObject ) );
					break;
				default:
					console.log('[ERROR] OpenObject.deserialize(). unrecogizable key: '+key);
			}
		};
	}; // End of _OpenObject

	OSP._StyleObject = function(){
		var Style = this;
		Style.style = function( style ){
			return Style.property.apply( Style, OSP.Util.addFirstArgument(OSP.Constants.STYLE, arguments) );
		};

		Style.css = function( key, value ){
			switch( arguments.length ){
			case 1:
				var style = Style.style();
				if( !style )	return	false;
				return style[key];
			case 2:
				var style = Style.style();
				if( !style ){
					style = {};
					Style.style(style);
				}
				return style[key] = value;
			default:
				return false;
			}
		};

		Style.removeCss = function( key ){
			var style = Style.style();
			if( !style )	return true;

			delete style[key];
		};
	}; // End of _StyleObject
	
})(window);