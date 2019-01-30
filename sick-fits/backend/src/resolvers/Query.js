const {forwardTo} = require('prisma-binding');
const {hasPermission} = require('../utils')

const isUserLoggedIn = ctx => ctx.request.userId ? true : false;

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    if (!isUserLoggedIn(ctx)) {
      return null;
    }

    return ctx.db.query.user(
      {
        where: {id: ctx.request.userId},
      },
      info,
    );
  },
  async users(parent, args, ctx, info) {
    if(!isUserLoggedIn(ctx)) {
      throw new Error('You must be logged in!')
    }

    console.log('before hasPermission')
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    console.log('after hasPermission')
    return ctx.db.query.users({}, info);
  }
};

module.exports = Query;
