define([
	'app/utils/Global'
	,'app/views/GameScreen'
], function(_g, GameScreen){
	"use strict"
	if (!window.__smgctrl){
		var fn = function(){
			var allowClick = true, ms, timer, score, view, clickIndex, click1, click2, itemsFound, allItems,
			reset = function(){
				click1 = click2 = null;
				clickIndex = 0;
				allowClick = true;
			},
			updateTime = function(){
				ms++;
				view.time.text("time passed: "+(ms*.01).toFixed()+"s")
			},
			updateScore = function(){
				view.score.text(score+" points");
			},
			handleItemClick = function(element){
				if (!allowClick) return;
				allowClick = false;
				clickIndex++;
				switch(clickIndex){
					case 2: 
						if (click1 === element){
							reset();
							element.classList.remove('pressed');
							return;
						}

						click2 = element;
						if (click1.dataset.id != click2.dataset.id){
							score--;
							click2.classList.add('pressed');
							setTimeout(function(){
								click2.classList.remove('pressed');
								click1.classList.remove('pressed');
								reset();
							}, 500);
						}else{
							click2.classList.add('pressed');

							click1.classList.add('cleared');
							click2.classList.add('cleared');
							score +=5;
							itemsFound++;
							reset()
						}
						updateScore();

						if (itemsFound >= allItems){
							clearInterval(timer);
							Backbone.trigger(_g.events.SIGNAL_END_GAME);
						}
						break;
					case 1:
						click1 = element;
						click1.classList.add('pressed');
						allowClick = true;
						// block this item;
						break;
				}
			},
			_start = function(gameData){
				var i, ii, item, color, rnd;

				gameData = gameData || [];
				if (gameData.length < 3){ throw new Error(_g.errors.MIN_PLAYERS);}
				
				// double the items and generate random colors based on item's id (length of 32)
				// build gameview and start the timer

				trace("GAME:: initialize");
				this.items = [];
				
				for (i=0;i<gameData.length;i++){
					gameData[i].id = gameData[i].id.replace(/\-/ig,"");
					rnd = Math.round(Math.random()*25);
					gameData[i].color = gameData[i].id.substr(rnd, 6);

					this.items.push(gameData[i]);
					item = {};
					for (ii in gameData[i]){ item[ii] = gameData[i][ii];}
					this.items.push(item);
				}
				
				// scramble and hope for the best :]
				this.items.sort(function(){return .5 - Math.random();});
				this.items.sort(function(){return .5 - Math.random();});
				this.items.sort(function(){return .5 - Math.random();});

				view = new GameScreen({ collection: this.items}).render();

				allItems = gameData.length;
				itemsFound = score = 0;
				updateScore();

				ms = -1;
				updateTime();

				clickIndex = 0;
				timer = setInterval(updateTime,10);

				Backbone.on(_g.events.TILE_CLICK, handleItemClick);
				if (_g.stage){
					_g.stage.append(view.el);	
				}
			},
			_stop = function(){
				trace("GAME:: stop");
				Backbone.off(_g.events.TILE_CLICK);

				if (view){
					view.remove();
					view = null;	
				}
				if (timer){
					clearInterval(timer);
					timer = null;
				}
				ms = score = clickIndex = null;
			}
			return {
				start: _start,
				stop: _stop,
				view: function(){ return view;},
				score: function(){ return score;}
			}
		}
		window.__smgctrl = new fn();
	}
	return window.__smgctrl;
});