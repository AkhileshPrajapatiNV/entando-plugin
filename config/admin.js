module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '7ac41fd61b655a477d6b49de8b111248'),
  },
});
