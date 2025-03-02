package com.sx.dynamic.include.topjs;

import java.io.IOException;
import java.io.PrintWriter;

import com.liferay.portal.kernel.servlet.taglib.BaseDynamicInclude;
import com.liferay.portal.kernel.servlet.taglib.DynamicInclude;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.osgi.service.component.annotations.Component;

/**
 * @author jerry
 */
@Component(
	immediate = true,
	service = DynamicInclude.class
)
public class StationXTopJSDynamicInclude extends BaseDynamicInclude {

	@Override
	public void include(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, String key)
			throws IOException {
		
		PrintWriter printWriter = httpServletResponse.getWriter();
		
		String content = "";
		//String content = "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/mustache/mustache.min.js\" async ></script>";
		//content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/jquery/confirm/jquery-confirm.min.js\" async ></script>";
		
		//content += "<link rel=\"stylesheet\" href=\"/o/com.sx.dynamic.include/css/jquery/confirm/jquery-confirm.min.css\" >";
		//content += "<link rel=\"stylesheet\" href=\"//code.jquery.com/ui/1.13.1/themes/base/jquery-ui.css\">";
		//content += "<script charset=\"utf-8\" src=\"https://code.jquery.com/ui/1.13.1/jquery-ui.js\"></script>";
		//content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/station-x.js\" ></script>";
		//content += "<link rel=\"stylesheet\" href=\"/o/com.sx.dynamic.include/css/station-x.css\">";
		//content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/jquery/dateTimePicker/jquery.datetimepicker.full.min.js\"></script>";
		//content += "<link rel=\"stylesheet\" href=\"/o/com.sx.dynamic.include/css/jquery/dateTimePicker/jquery.datetimepicker.min.css\">";
		//content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/lodash.js\"></script>";
		//content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/zTree/js/jquery.ztree.all.js\"></script>";
		//content += "<link rel=\"stylesheet\" href=\"/o/com.sx.dynamic.include/js/zTree/css/zTreeStyle/zTreeStyle.css\">";
		
		
		/*
		content += "<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/@clayui/css/lib/css/atlas.css\">";
		content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/fancy-file-uploader/jquery.ui.widget.js\"></script>";
		content += "<link rel=\"stylesheet\" href=\"/o/com.sx.dynamic.include/js/fancy-file-uploader/fancy_fileupload.css\">";
		content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/fancy-file-uploader/jquery.fileupload.js\"></script>";
		content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/fancy-file-uploader/jquery.iframe-transport.js\"></script>";
		content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/fancy-file-uploader/jquery.fancy-fileupload.js\"></script>";
		*/
		//content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/dynamic-popup-menu/popmenu.js\"></script>";
		//content += "<link rel=\"stylesheet\" href=\"/o/com.sx.dynamic.include/js/dynamic-popup-menu/popmenu.css\">";
		//content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/multi-select/jquery.multi-select.js\"></script>";
		//content += "<link rel=\"stylesheet\" href=\"/o/com.sx.dynamic.include/js/multi-select/multi-select.css\">";
		//content += "<script charset=\"utf-8\" src=\"/o/com.sx.dynamic.include/js/simple-pagenation/jquery.simplePagination.js\"></script>";
		//content += "<link rel=\"stylesheet\" href=\"/o/com.sx.dynamic.include/js/simple-pagenation/simplePagination.css\">";
		content += "<script src=\"//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js\"></script>";
		
		content += "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js\"></script>";
		content += "<script src=\"https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js\"></script>";
		content += "<script src=\"https://cdn.jsdelivr.net/npm/jspdf-html2canvas@latest/dist/jspdf-html2canvas.min.js\"></script>";
		
		printWriter.println(content);
		
	}

	@Override
	public void register(
		DynamicInclude.DynamicIncludeRegistry dynamicIncludeRegistry) {
	
		dynamicIncludeRegistry.register(  "/html/common/themes/top_head.jsp#post" );
	}
}