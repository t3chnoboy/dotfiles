/**
 * RG3 Photo Zoom for Facebook
 * Author: Regis Gaughan, III
 * Email:  regis.gaughan@gmail.com
 * Web:    http://regisgaughan.com
 * (c) Copyright 2012. All Right Reserved
 */
var RG3=RG3||{};RG3.storage=RG3.storage||{set:function(b,c){var a;try{RG3.storage.remove(b);window.localStorage.setItem(b,JSON.stringify(c))}catch(d){}},get:function(a){var b;try{return JSON.parse(window.localStorage.getItem(a))}catch(c){}return null},remove:function(a){return window.localStorage.removeItem(a)},clear:function(){window.localStorage.clear()}};"\n" 
