const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');



module.exports = (app) => {
    app.use('/api', authRoutes);
    app.use('/api/dashboard', dashboardRoutes);
};