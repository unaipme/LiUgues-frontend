import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('next-rounds-view', 'Integration | Component | next rounds view', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{next-rounds-view}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#next-rounds-view}}
      template block text
    {{/next-rounds-view}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
