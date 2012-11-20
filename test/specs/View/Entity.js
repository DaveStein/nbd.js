/*global jasmine, describe, it, expect, spyOn, loadFixtures */
define(['jquery', 'nbd/View/Entity', 'View', 'Model'], function($, Entity, View, Model) {
  'use strict';

  describe('View.Entity', function() {

    it('should exist', function() {
      expect( Entity ).toBeDefined();
    });

    it('should extend View', function() {
      expect( Entity ).toEqual(jasmine.any(View));
    });

    it('should have prototype methods', function() {
      expect( Entity.prototype.init ).toBeDefined();
      expect( Entity.prototype.templateData ).toBeDefined();
      expect( Entity.prototype.render ).toBeDefined();
    });

    describe('View.Entity.prototype.init', function() {

      it('should accept a Model', function() {
        var id = Date.now(),
        model = new Model( id, {} ),
        instance = new Entity(model);

        expect( instance.id ).toBeDefined();
        expect( instance.id() ).toBe(id);
        expect( instance.Model ).toBe( model );
      });

      it('should accept non-Models', function() {
        var id = Date.now(),
        instance = new Entity(id);

        expect( instance.id ).toBeDefined();
        expect( instance.id() ).toBe(id);
        expect( instance.Model ).not.toBeDefined();
      });

    });

    describe('View.Entity.prototype.templateData', function() {

      it('should return an object with the Model', function() {
        var model = new Model( 0, {} ),
        instance = new Entity(model);

        expect( instance.templateData ).toBeDefined();
        expect( instance.templateData() ).toBeTypeOf('object');
        expect( instance.templateData().Model ).toBe( model );
      });

    });

    describe('View.Entity.prototype.render', function() {
      Entity.TEMPLATE_ID = 'entity-template';

      it('should render a template into the parent element', function() {
        loadFixtures('entity.html');

        var id = Date.now(),
        item = 'lorem ipsum',
        $test = $('#entity-test').html('<br>'),
        model = new Model( id, {item:item} ),
        instance = new Entity(model);

        instance.rendered = $.noop;
        spyOn( instance, 'rendered' );
        spyOn( instance, 'templateData' ).andCallThrough();

        instance.render($test);

        expect( $test ).toContain('br');
        expect( $test.text() ).toEqual(id+' : '+item);
        expect( instance.rendered ).toHaveBeenCalled();
        expect( instance.templateData ).toHaveBeenCalled();
      });

      it('should re-render without a parent element', function() {
        loadFixtures('entity.html');

        var id = Date.now(),
        item = 'lorem ipsum',
        $test = $('#entity-test'),
        model = new Model( id, {item:null} ),
        instance = new Entity(model);

        instance.rendered = $.noop;
        spyOn( instance, 'rendered' );
        spyOn( instance, 'templateData' ).andCallThrough();

        instance.render($test);

        model.set('item', item);
        instance.render();

        expect( $test.text() ).toEqual(id+' : '+item);
        expect( instance.rendered ).toHaveBeenCalled();
        expect( instance.templateData ).toHaveBeenCalled();
      });

      it('should not render when there\'s no parent and has not already been rendered', function() {
        loadFixtures('entity.html');

        var id = Date.now(),
        item = 'lorem ipsum',
        $test = $('#entity-test'),
        model = new Model( id, {item:null} ),
        instance = new Entity(model);

        instance.rendered = $.noop;
        spyOn( instance, 'rendered' );
        spyOn( instance, 'templateData' ).andCallThrough();

        instance.render();

        expect( $test ).toBeEmpty();
        expect( instance.rendered ).not.toHaveBeenCalled();
        expect( instance.templateData ).not.toHaveBeenCalled();
      });

      it('should not re-render, only reattach, when it has been rendered and there is a parent', function() {
        loadFixtures('entity.html');

        var id = Date.now(),
        item = 'lorem ipsum',
        $test = $('#entity-test'),
        model = new Model( id, {item:null} ),
        instance = new Entity(model);

        instance.rendered = $.noop;
        spyOn( instance, 'templateData' ).andCallThrough();
        instance.render($test);

        spyOn( instance, 'rendered' );
        model.set('item', item);
        instance.render($test);

        expect( $test.text() ).toEqual(id+' : null');
        expect( instance.rendered ).not.toHaveBeenCalled();
        expect( instance.templateData.callCount ).toBe(1);
      });

      it('should always render when it has been pre-templated', function() {
        loadFixtures('entity.html');

        var id = Date.now(),
        item = 'lorem ipsum',
        $test = $('#entity-test'),
        model = new Model( id, {item:item} ),
        instance = new Entity(model);

        instance.rendered = $.noop;
        spyOn( instance, 'rendered' );
        spyOn( instance, 'templateData' ).andCallThrough();
        instance.$view = '<span>Hello world</span>';

        instance.render($test);

        expect( $test.text() ).toEqual('Hello world');
        expect( instance.rendered ).toHaveBeenCalled();
        expect( instance.templateData ).not.toHaveBeenCalled();
      });

      it('should do nothing when it was pre-templated but there\'s no parent', function() {
        loadFixtures('entity.html');

        var id = Date.now(),
        item = 'lorem ipsum',
        $test = $('#entity-test'),
        model = new Model( id, {item:item} ),
        instance = new Entity(model);

        instance.rendered = $.noop;
        spyOn( instance, 'rendered' );
        spyOn( instance, 'templateData' ).andCallThrough();
        instance.$view = '<span>Hello world</span>';

        instance.render();

        expect( $test ).toBeEmpty();
        expect( instance.rendered ).not.toHaveBeenCalled();
        expect( instance.templateData ).not.toHaveBeenCalled();
      });
    });
  });
});