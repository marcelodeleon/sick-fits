const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const {randomBytes} = require('crypto');

const setJWTCookie = ( ctx, token ) => {
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 24 * 365, // 1 year cookie.
  });
}

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
    setJWTCookie(ctx, token);

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

    const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
    setJWTCookie(ctx, token);

    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');

    return {message: 'Goodbye'};
  },
  async requestReset(parent, {email}, ctx, info) {
    const user = await ctx.db.query.user({where: {email}});
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    await ctx.db.mutation.updateUser({
      where: {email},
      data: {resetToken, resetTokenExpiry},
    });

    return {message: 'Thanks!'};
  },
  async resetPassword(parent, args, ctx, info) {
    const {resetToken, password, confirmPassword} = args;
    if (password !== confirmPassword) {
      throw new Error('Password and confirm password do not match.');
    }

    const [user] = await ctx.db.query.users({
      where: {resetToken, resetTokenExpiry: Date.now - 3600000},
    });

    if (!user) {
      throw new Error('Not allowed to change password');
    }

    const newPassword = await bcrypt.hash(password, 10);
    const res = await ctx.db.mutation.updateUser({
      where: {id: user.id},
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    const token = jwt.sign({userId: user.id}, process.env.APP_SECRET);
    setJWTCookie(ctx, token)

    return res;
  },
};

module.exports = Mutations;
