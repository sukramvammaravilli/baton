


        await pool.query(
            `
            INSERT INTO users
            (
                username,
                email,
                password
            )
            VALUES
            (?,?,?)
            `,
            [
                username,
                email,
                hash
            ]
        );

        res.status(201).json({
            message:
            'Registration successful'
        });