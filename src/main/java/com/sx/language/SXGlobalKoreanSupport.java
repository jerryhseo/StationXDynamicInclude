package com.sx.language;

import com.liferay.portal.kernel.language.UTF8Control;

import java.util.Enumeration;
import java.util.ResourceBundle;

import org.osgi.service.component.annotations.Component;

@Component(
		immediate = true,
	    property = { "language.id=ko_KR" }, 
	    service = ResourceBundle.class
	)
public class SXGlobalKoreanSupport extends ResourceBundle {
	
	private final ResourceBundle _resourceBundle = ResourceBundle.getBundle(
	        "content.Language_ko_KR", UTF8Control.INSTANCE);

	@Override
	protected Object handleGetObject(String key) {
		return this._resourceBundle.getObject(key);
	}

	@Override
	public Enumeration<String> getKeys() {
		return this._resourceBundle.getKeys();
	}

}
