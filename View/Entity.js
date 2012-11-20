define(['jquery', 'nbd/View', 'nbd/Model'], function($, View, Model) {
  "use strict";

  var constructor = View.extend({

    init : function( model ) {
    
      if ( model instanceof Model ) {
        this.Model = model;
        this.id = this.Model.id;
      }
      else {
        this.id = function() { return model; };
      }
    
    },
    
    // all data needed to template the view
    templateData : function() {
      return this.Model ? this.Model.data() : this.id();
    },
    
    render : function( $parent ) {

      // $existing could be a string
      var $existing = this.$view,
          fresh = !!$existing ^ !!$parent;

      // When there's either no rendered view XOR there isn't a parent
      if ( fresh ) {
        if (typeof $existing !== "string" ) {
          this.$view = this.template( this.templateData() );
        }
      }
      else if ( !$existing ) {
        return;
      }

      if (typeof $existing === "string") {
        this.$view = $(this.$view);
        fresh = !!$parent;
        if ( !fresh ) { return; }
      }

      if ( $parent ) {
        $parent.append( this.$view );
      }
      else {
        $existing.replaceWith( this.$view );
      }

      if ( fresh && typeof this.rendered === 'function' ) {
        this.rendered();
      }

      return this.$view;

    } // render
    
  }); // View Entity

  return constructor;

});
