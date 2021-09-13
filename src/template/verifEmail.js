const verifEmail = (token, name) => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        * {
            margin: 0;
            padding: 0;
        }

        .header {
            height: 8vh;
            background-color: #f5f8fa;
            box-sizing: border-box;
        }

        .footer {
            height: 15vh;
            background-color: #f5f8fa;
            box-sizing: border-box;
        }

        .footer p {
            color: #bbbfc3;
            font-size: 12px;
            line-height: 15vh;
        }

        .header p {
            color: #bbbfc3;
            font-weight: bold;
            line-height: 8vh;
            font-size: 19px;
        }

        .box-email {
            width: 50%;
            margin: auto;
        }

        .font-size19px {
            font-size: 19px;
        }

        .font-size16px {
            font-size: 16px;
        }

        .margin-top20px {
            margin-top: 20px;
        }

        .font-wigthBold {
            font-weight: bold;
        }

        .button-verif {
            text-decoration: none;
            display: inline-block;
            background-color: #3097d1;
            padding: 10px;
            color: #ffffff !important;
            border-radius: 10px;
        }

        .box-email {
            color: #81848a;
        }
    </style>
</head>

<body>
    <div class="header">
        <center>
            <p>TokoKu</p>
        </center>
    </div>
    <div class="box-email">
        <p class="font-size19px margin-top20px font-wigthBold">Hello ${name}!</p>
        <p class="font-size16px margin-top20px">Please click the button below to verify your email address.</p>
        <a target="_blank" href="${process.env.URL_FRONTEND}/verifemailregister?veriftoken=${token}"
            class="button-verif margin-top20px">Verify Email Address</a>
        <p class="font-size16px margin-top20px">If you did not create an account, no further action is required.</p>
        <p class="font-size16px margin-top20px">Regards,</p>
        <p class="font-size16px">TokoKu</p>
    </div>
    <div class="footer margin-top20px">
        <center>
            <p>© 2021 TokoKu. All rights reserved.</p>
        </center>
    </div>
</body>

</html>`;

module.exports = verifEmail;
