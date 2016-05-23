import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('game-goal-mgm', 'Integration | Component | game goal mgm', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{game-goal-mgm}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#game-goal-mgm}}
      template block text
    {{/game-goal-mgm}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
