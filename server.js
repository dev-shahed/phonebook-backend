const app = require("./app");
const port = process.env.PORT || 3001;
app.listen(port, () => `Server running on port ${port} 🔥`);
