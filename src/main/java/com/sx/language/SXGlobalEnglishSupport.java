package com.sx.language;

import com.liferay.portal.kernel.language.UTF8Control;

import java.util.Enumeration;
import java.util.ResourceBundle;

import org.osgi.service.component.annotations.Component;

@Component(
		immediate = true,
	    property = { "language.id=en_US" }, 
	    service = ResourceBundle.class
	)
public class SXGlobalEnglishSupport extends ResourceBundle {
	
	private final ResourceBundle _resourceBundle = ResourceBundle.getBundle(
	        "content.Language_en_US", UTF8Control.INSTANCE);

	@Override
	protected Object handleGetObject(String key) {
		return _resourceBundle.getObject(key);
	}

	@Override
	public Enumeration<String> getKeys() {
		return _resourceBundle.getKeys();
	}

}
