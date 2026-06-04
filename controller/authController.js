const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../dbConnection/connection');
const userValidation = require('../utilities/userValidation');

module.exports = {
login : async (req, res) => {
        try {

           let params = { 
                username: req.body.username,
                password: req.body.password

            };

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
    },
    
register : async (req, res) => {
    try {
        let params = { 
            username: req.body.userame,
            password: req.body.password,
            fullname: req.body.fullname
        };

        let validation  = await userValidation.validateUser(params);
        if (validation) {
        const hash = await bcrypt.hash( params.password, 10);
        console.log(hash)
        }


    } catch(error){

        res.status(500).json({
            error:error.message
        });
    }
}
}