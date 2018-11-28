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
};

module.exports = Mutations;
