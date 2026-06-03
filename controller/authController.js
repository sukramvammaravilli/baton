const bcrypt =
    require('bcryptjs');

const jwt =
    require('jsonwebtoken');

const pool =
    require('../db/connection');

const login =
    async (req, res) => {

        try {

            const {

                username,
                password

            } = req.body;

            const [users] =
                await pool.query(

                    `
                    SELECT *
                    FROM users
                    WHERE username=?
                    `,

                    [username]

                );

            if (
                users.length === 0
            ) {

                return res
                .status(401)
                .json({

                    error:
                    'Invalid credentials'

                });
            }

            const user =
                users[0];

            const isMatch =
                await bcrypt.compare(

                    password,

                    user.password

                );

            if (!isMatch) {

                return res
                .status(401)
                .json({

                    error:
                    'Invalid credentials'

                });
            }

            const token =
                jwt.sign(

                    {

                        userId:
                            user.id,

                        username:
                            user.username

                    },

                    process.env.JWT_SECRET,

                    {

                        expiresIn:
                            '1h'

                    }
                );

            res.json({

                token

            });

        } catch (error) {

            res.status(500)
            .json({

                error:
                    error.message

            });
        }
    };

module.exports = {

    login

};