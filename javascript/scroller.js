// Scroller v2

var Scroller = new Class({
	Implements: [Options, Events],
	
	options: {
		steps: 14,
		onScroll: $empty
	},
	
	initialize: function(container, handle, options){
		this.setOptions(options);
		this.container = $(container);
		this.handle = $(handle);
		this.track = this.handle.getParent();
		
		this.pos = {};
		
		this.bound = {
			'dragHandle': this.dragHandle.bind(this),
			'startDragHandle': this.startDragHandle.bind(this),
			'stopDragHandle': this.stopDragHandle.bind(this),
			'scroll': this.scroll.bind(this)
		};
		
		this.updateStyles();
		this.attachEvents();
	},
	
	updateStyles: function(){
		this.container.setStyle('overflow', 'hidden');
		this.container['scrollTop'] = 0;
		this.handle.setStyle('position', 'relative');
		this.handle.setStyle('height', this.track['offsetHeight']*(this.container['offsetHeight']/this.container['scrollHeight']));
		this.handle.setStyle('top', (this.container['scrollTop']/this.container['scrollHeight']*this.track['offsetHeight']));
	},
	
	attachEvents: function(){
		this.container.getParent().addEvent('mousewheel', this.bound.scroll);
		this.handle.addEvent('mousedown', this.bound.startDragHandle);
	},
	
	adjustHandle: function(){
		this.handle.setStyle('top', (this.container['scrollTop']/this.container['scrollHeight']*this.track['offsetHeight']));
	},
	
	adjustContent: function(){
		this.container['scrollTop'] = (this.handle.getStyle('top').toInt()/this.track['offsetHeight']*this.container['scrollHeight']);
	},
	
	startDragHandle: function(e){
		e.stop();
		this.handleStart = this.handle.getStyle('top').toInt();
		this.mouseStart = e.page['y'];
		document.addEvent('mousemove', this.bound.dragHandle);
		document.addEvent('mouseup', this.bound.stopDragHandle);
		document.body.setStyle('cursor', 'pointer');
	},
	
	dragHandle: function(e){
		e.stop();
		this.handle.setStyle('top', (this.handleStart + (e.page['y'] - this.mouseStart)).limit(0, (this.track['offsetHeight']-this.handle.getStyle('height').toInt())));
		this.adjustContent();
	},
	
	stopDragHandle: function(e){
		e.stop();
		document.removeEvent('mousemove', this.bound.dragHandle);
		document.removeEvent('mouseup', this.bound.stopDragHandle);
		document.body.setStyle('cursor', '');
	},
	
	scroll: function(e){
		e.stop();
		
		this.container['scrollTop'] = this.container['scrollTop']-(e.wheel*this.options.steps);
		
		this.adjustHandle();
		
		this.fireEvent('scroll', -(e.wheel*this.options.steps));
	}
});