export default function calcTotalItems(cart) {
  return cart.reduce(
    (tally, cartItem) => (cartItem.item ? tally + cartItem.quantity : tally),
    0,
  );
}
