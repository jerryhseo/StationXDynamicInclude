const SXSystem ={
	loadStartPortletModuleScript: (srcUrl)=>{
		const oldScript = document.querySelector(`script[src^="${srcUrl}"]`);
		if (oldScript){
			console.log("Old script removed...");
			oldScript.remove();
		}
		
		const newScript = document.createElement('script');
		newScript.type = 'module';
		newScript.src = `${srcUrl}?v=${Date.now()}`; // cache-busting
		document.head.appendChild(newScript);
	}	
};