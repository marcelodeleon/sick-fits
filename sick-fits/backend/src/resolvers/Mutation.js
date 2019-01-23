const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info,
    );

    return item;
  },
  updateItem(parent, args, ctx, info) {
    // Take a copy of the updates and remove the id.
    const updates = {...args};
    delete updates.id;

    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id,
        },
      },
      info,
    );
  },
  async deleteItem(parent, args, ctx, info) {
    const where = {id: args.id};

    // Intermediary query, instead of passing info we pass
    // raw GraphQL to specify what is returned.
    const item = await ctx.db.query.item({where}, `{id title}`);

    return ctx.db.mutation.deleteItem({where}, info);
  },
  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();

    // Hash password.
    const password = await bcrypt.hash(args.password, 10);

    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: {set: ['USER']},
        },
      },
      info,
    );

    const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);

    // Set token into a cookie.
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 24 * 365, // 1 year cookie.
    });

    return user;
  },
  async signin(parent, {email, password}, ctx, info) {
    const user = await ctx.db.query.user({where: {email}});
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }

    // No need to refactor since it's used just two times in here,
    // keep in mind.
    const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 24 * 365, // 1 year cookie.
    });

    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');

    return {message: 'Goodbye'};
  },
};

module.exports = Mutations;
