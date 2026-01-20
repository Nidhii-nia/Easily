export const setLastVisited = (req, res, next) => {
  //if cookies set , then add a local variable to store last visited time data
  if (req.cookies.lastVisited) {
    res.locals.lastVisited = new Date(req.cookies.lastVisited).toLocaleString();
}

    res.cookie('lastVisited',new Date().toISOString(),{
    maxAge:3*24*60*60*1000
  })

  next();
};
