export const paginate = (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const sort = req.query.sort === "asc" ? 1 : -1;

  req.paginationOptions = {
    page,
    limit,
    sort: { updatedAt: sort },
  };
  next();
};
