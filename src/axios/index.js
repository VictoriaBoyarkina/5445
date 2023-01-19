import express from "express";

const router = express.Router();

const OLD_TOKEN =
  "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.cTJwBk892jgEr-2jqS3k4GdHnG3ml510587yj7o15FTKxY_WuUE8p9spaikKB-hOb56kM6O245b0qFm6VMvVUN0kFuviLWjVT-2npdGE18Xz9SVRiM0Yv5LRTZ7BUALGXVmjD65eDjUoJ1zoiDyhh0QhBOf5kKxuhtovYkR9gXLKABWe_fAkx32LB8QqJf4FSRCnMX8MAH3xhkcKii1hsdItu5qKZp-lLIxdvPqWjpCllJlhKEbO60D52NAjDVJTRBecK8aaVeuydNOLY8vQAkJUOqEs-UTOw1gyyFoE58imYYaECcpeXqNgGy5UrX19Neeo41S3GATLBVPDRxTh4Q.zd8w5IsSe_MHU9Es4A10TQ.4rJEbOt6WkrZwu3wOIRyU95hHMrKU0_X_SH5oWGrlML-cier_-JhE6dRQzzykSq9pmN2K-46HWWyXd33pOW2yXXQSPoDILrYa87CTXLYcQAp_QIUuDfMfsLCviGNhpsDI_rwKwwrl8xe_f5vDgZPCEtT4BFAu-ORB-KoV8Yj6S18N_4i6pNXJd4MQKYuyhvhQ6PNS34PCSw0e71_xAY3vdZLV7nRipGFaFz9Ct-6XOlGPZWS1st_KxllQgUyEBXTSmAN-fRcQlcO2Ri6gpeUjm76NJ-HiwZso2cK_e5MYPinKVtTavLuZFLpIOkJUvM3etTP7I2KDaFrJHnfDXT53EKciXDe8SypZNzPQEFJ_2RDYD9nxh_Yj22wOdg2GBNWSIicgaHD90j48zYefUzAY-psPxMKH9ljT9iYeNTvNbaiDAyb3xC_J0qOosIrKqBHvC-00QVBMzdh0ht8m7luoZyWeZJVKYLDQfA9Y4-5QnN8kZecnySdpyFjZwvuz5ew9O0jimjjICtSgmSMf6njBIkBXR7T0dc15dZyyEohAoYCTTKYKOgMfBzQSy1WmXuD1X5kZXF8LUbTUcc4BpXScsBV452XYDOZoHMEQn2YlntrLmavNlad7YtIamI5bvT8NiHkDKikeQ1TWbKZl1Yj1k9vKq9r3Zy3B3xLo5mnTMU7Wyve4ILeKZFT-3Ruu0gm6nP0Ko3fcXdFhWrelwrvoFKqE8eor15MsuGltweG-oZ9msUiO9CFAtqEV0tuz-CXw--EVGgc7MnGT-pd6WYQkduto9GPEh6jaoaIb1NUTbkT9hq88ayWyzA31Hpg7m8LEpP4NflBFjV8HpI6ai13P0dqeHrreJyciZJ3fKvZhVMtZrI71h5muftK04RAS9g13J3m-t5wrsi2tT-0F9DexO3s1ETUmmhxHUS80ojiCwl87FbEqNcbrVop9LR_Zg-cROP3PuUtWsxkjMsWwNkWetVFjk59DDqZaRMise3AbaT5kKUYJ9ZzKPPsw9muEtJb-CVNnJnb4L0OQCzFJhMatRxy-3WbY6StGQ0FRl7zhFuKUGVeCL_k79gl4kU-MW9YAkSVxyLDN-qeyIBC7_nzM6tk805ugsuMokUGjFk9r14kf2PLLx2Po__zJY2eRUIdwX1dTkXHT7bw38UG8_gM2r7zeXY1v23crKBPAYYGYyw.RzU69UdzdfMJdAYNfRIIHg";
const NEW_TOKEN =
  "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2IiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.IiWztZXSaWzVZyl-bgPlpmIVzFd-ErTBerK2dxfdE6iYEwO1E06ekc-RCnd99UajPDomsg1OHudr_3TM3ItD62LD_w58xMHq_a5rYQT6NYCKnftY1GY3gs6mIhQuCFY9HcBwgL-ta4XlQEILF8ujDIP_Yi7xjN4dJFryXukgaZ7MI7BXYRIj_gAgnLnABDX055SZM5BfmRp6FSIwPNtrkoRQDvir3Dsd64BEVA8YnHIgwchtavbs5FnLx9OwyJaRzDGHnxE3tA-G22Sbtsga4JaUr-zX_eDr6ZWMmE1VT9qYU8B6YpVatqOAYs_RktZqdi2M_Z-yIAGdvoQyplWt0Q.hdWBYX4Zaw-QT6g2yxJatQ.jGw4hrCxP97kIqPJcSfMk2a3uMhIBOi2YGaU08RqKGz8xMz_Sdqo9Bk2cCXhxuzmU11PNS92cQTBFFkkdSGVb_t1PyZFUReMvVYU9EFViOj23TFFDIfC7ZMjMaEDj0rssWp1Zi_JLzwrCj4UpkQSVO_VzyuaiRzup4Uij_K9f-1KiPCrFwc5VfvIg_5oPxFGDU4eH5KJCFg0egflWq6uS1FJTzO8XpkxPl9yS2GEjHw88WMY-_8FPVi21miIDDQY6zi1O6F9ZKXsVXb6_LoQTQGNMr-borHYoEDW6HwQbTFllLu0a4DD6rs6XDFp43bJD6touXq6XNgy9Iti4l6d6jHf2rVJfmKNmIk5yw_mjOob_WSKcLnCPD2ZPExmh6BzDQ_VIMxVvf3lPIeHb3Xc8zfKqYp7i7uuKN39z9DqXy34qmrYqjrHPB_CNjWPWm8cE91bXhs-M859kOf7cIhcuLiV8kwPAw0rD2ddwkvXJnUtwmlVsVBjioEI6Ectvx8t_qVU8pg3gdSEm_o8EY9Ya09KhEHKJUcNQoRXQY2isHaujRY3t6t7DXk6C2O7AwePdI0BMrgYk0jcUOkzVlKVL97TGP2Ogk9VJlx3nO4QTPP5OHUQ44igXckCXqNvv4d3ITsX4BSP6JwDWAsyjaap6wD7MRpSeXVbJVF7lGSKbrkuKjb5fMfBZ84QEJaq1-ItExjqnGKAlZsPL60tu5CY4a8fDX_bZ243DN3syYN1GDQdsII418faeFCdqaIicYatXVlkdo5tXlJcJn1aAxjwer8KygWLcjw2_RTIuGkZveXcF0Ix4c_Z2WXmLoHdAcyzJg4NhJ1X8IXKUFeLLmLVfuQy3J59Zqgs38_Bfh7QGi7xj5CoiqO_guV0h4TTTbnznCGXRb1R5pG1_2jpSVd_KAGiPUeXcKuT4NZVQ1xVZOIN5qefaWSbNtQ9WB3YotTBp_ZCFTzcMvPRT2GY43nX2NWYlJDZcAlw3s_BVIRQh6VZPT16chyH9W4wkA_CeiIv1jMKS5YGFHXTUnjBtvk2W3hZEy5CE7hu7d89OmqfUXurYixxSN40OaqMkc4V1GFkHIDl7OWEhgP5SRqlH17KMXFtUOob7YxFDkzFpzW4_zA.vA9t_YWfA3npuVATuMXxew";

router.get("/token", (req, res) => {
  res.json({
    token: OLD_TOKEN,
  });
});

router.post("/refresh", (req, res) => {
  const body = req.body || {};

  if (!body.token) {
    res.status(400);
    res.json({
      error: true,
      message: "field token is required",
    });
    return;
  }

  if (body.token !== OLD_TOKEN) {
    res.status(400);
    res.json({
      error: true,
      message: "token not found",
    });
    return;
  }

  res.json({
    token: NEW_TOKEN,
  });
});

/** @type {import("express").RequestHandler} */
function tokenCheck(req, res, next) {
  const token = req.headers["authorization"];

  if (token !== `Bearer ${NEW_TOKEN}`) {
    res.status(401);
    res.json({
      error: true,
      message: "Unauthorized",
    });
    return;
  }

  next();
}

router.get("/first", tokenCheck, (req, res) => {
  res.json({ first: "success" });
});

router.post("/second", tokenCheck, (req, res) => {
  if (!req.body?.type) {
    res.status(400);
    res.json({
      error: true,
      message: "field type is required",
    });
    return;
  }

  res.json({ second: "success", type: req.body.type });
});

let errorArr = true;
router.get("/error", (req, res) => {
  const errors = errorArr
    ? ["Ошибка в массиве №1", "Ошибка в массиве №2"]
    : "Ошибка строкой";
  errorArr = !errorArr;
  res.status(400);
  res.json({
    error: true,
    errors,
  });
});

router.post("/form-error", (req, res) => {
  res.status(400);
  res.json({
    error: true,
    errors: [
      {
        fieldName: "title",
        errors: [
          "Минимальная длина 3 символа",
          "Допустимые символы - латиница",
        ],
      },
      {
        fieldName: "url",
        errors: ["Неверный формат ссылки"],
      },
    ],
  });
});

router.get("/long", (req, res) => {
  setTimeout(() => {
    res.json({
      message: "success",
    });
  }, 3000);
});

export { router as axiosRouter };
