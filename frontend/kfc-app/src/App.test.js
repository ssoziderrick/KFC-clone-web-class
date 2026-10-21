import { CARTCOUNT } from './redux/action';
import { reducer } from './redux/reducer';

test('applies server-confirmed cart quantities without double counting', () => {
  const state = { cart: [{ id: 'meal-1', title: 'Meal', qty: 1 }] };
  const nextState = reducer(state, {
    type: CARTCOUNT,
    payload: { id: 'meal-1', title: 'Meal', qty: 3 },
  });

  expect(nextState.cart).toHaveLength(1);
  expect(nextState.cart[0].qty).toBe(3);
});

test('removes an item from the cart when its quantity reaches zero', () => {
  const state = { cart: [{ id: 'meal-1', title: 'Meal', qty: 1 }] };
  const nextState = reducer(state, {
    type: CARTCOUNT,
    payload: { id: 'meal-1', title: 'Meal', qty: 0 },
  });

  expect(nextState.cart).toEqual([]);
});
