import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('country-league-mgm', 'Integration | Component | country league mgm', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{country-league-mgm}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#country-league-mgm}}
      template block text
    {{/country-league-mgm}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
