/**
 *
 * @name jQuery uploader
 * @namespace jQuery
 * @description a html5 uploader for firefox and chrome and with gracefull degradation for ie
 * @require
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 */
(function( $, undefined ) {
$.widget( "ui.uploader", {
  options: {
    button: '.add',
    preview: '.preview',
	width: 250,
    dragOverClass: '.dragover',
    fileAdded: function(){}
  },
  _create: function() {
    var self = this;
    var el = this.element;
    var op = this.options;
    $(el).css('opacity', 0);
    
		if(window.FileReader) {
			$(op.button).bind('click.uploader', function(e){
				$(el).bind("change", function(evt){
					self.fileChange(evt, op, self)
				});
				$(el).click();
				return false;	
			});
		} else {
			$(op.button).hide();
			$(el).css('opacity', 1);
		}
		//this.dropbox();
  },
  dropbox: function() {
  	var self = this;
  	var dropboxEl = $('.image-field').get(0);
  	dropboxEl.addEventListener("dragenter", this.dragenter, false);
  	dropboxEl.addEventListener("dragleave", this.dragExit, false);
		dropboxEl.addEventListener("dragover", this.dragOver, false);
		dropboxEl.addEventListener("drop", function(evt){
			self.drop(evt, self);
		}, false);
  },
  dragEnter: function(evt) {
		evt.stopPropagation();
		evt.preventDefault();
  },
  dragExit: function(evt) {
		$('.image-field').removeClass('dragover');
		evt.stopPropagation();
		evt.preventDefault();
  },
  dragOver: function(evt) {
		$('.image-field').addClass('dragover');
		evt.stopPropagation();
		evt.preventDefault();
  },
  drop: function(evt, self) {
		evt.target.files = evt.dataTransfer.files;
		var count = evt.target.files.length;
 
		// Only call the handler if 1 or more files was dropped.
		if (count > 0) {
			self.fileChange(evt, self.options, self);
			$('.image-field').removeClass('dragover');
		}
		evt.stopPropagation();
		evt.preventDefault();
  	
  },
  sendData: function(file){
  	var formElement = $(this.element).parents('form').get(0);
  	$(formElement).submit(function(f) {
			var xhr = new XMLHttpRequest();
			var formData = new FormData(f.target);
			formData.append(f.target.name, file);
	  	xhr.open("POST", f.target.action, true);
  	 	xhr.onloadend = function(oEvent) {  
				console.info(oEvent);
				//window.location = '/';
			};
	  	xhr.send(formData);
	  	return false;
  	});
	},
  fileChange: function(evt, opts, self) {
  	var files = evt.target.files;
		var img = document.createElement("img");
		var element = $(self.element).get(0);
		img.width = opts.width;
    img.classList.add("obj");
    var reader = new FileReader();
 		// Closure to capture the file information.
		var f = reader.onload = function(theFile) {
	      var result = theFile.target.result;
	      img.src = result;
	      $(opts.preview).hide().html(img).fadeIn('slow');
	      if(opts.onFileAdded) {
			opts.onFileAdded.call(this, files, opts);
		}
			
	      //self.sendData(files[0]);
  	};
    reader.readAsDataURL(files[0]);
  },
  destroy: function() {

  }
});

})(jQuery);