const express = require("express");
const router = express.Router();

const db = require("../db");


// ==================================
// LAY SO THU TU
// ==================================

router.post("/lay-so",(req,res)=>{

    const soDienThoai = req.body.so_dien_thoai;


    if(!soDienThoai){

        return res.json({
            message:"Chua nhap so dien thoai"
        });

    }


    db.query(
        "SELECT MAX(so_thu_tu) AS so_lon_nhat FROM hang_doi",

        (err,result)=>{


            if(err){
                return res.json(err);
            }


            let soThuTu = 1;


            if(result[0].so_lon_nhat != null){

                soThuTu = result[0].so_lon_nhat + 1;

            }



            db.query(

                `
                INSERT INTO hang_doi
                (so_dien_thoai, so_thu_tu, trang_thai)
                VALUES(?,?,?)
                `,

                [
                    soDienThoai,
                    soThuTu,
                    "dang_cho"
                ],


                (err)=>{

                    if(err){
                        return res.json(err);
                    }


                    res.json({

                        message:"Lay so thanh cong",

                        so_thu_tu:soThuTu

                    });


                }

            );


        }
    );


});





// ==================================
// GOI SO TIEP THEO (NEXT)
// ==================================

router.put("/goi-so",(req,res)=>{


    // Hoan thanh so dang phuc vu

    db.query(

        `
        UPDATE hang_doi
        SET trang_thai='da_xong'
        WHERE trang_thai='dang_phuc_vu'
        `,

        (err)=>{


            if(err){
                return res.json(err);
            }



            // Lay so tiep theo

            db.query(

                `
                SELECT *
                FROM hang_doi
                WHERE trang_thai='dang_cho'
                ORDER BY so_thu_tu ASC
                LIMIT 1
                `,


                (err,result)=>{


                    if(err){
                        return res.json(err);
                    }



                    if(result.length == 0){

                        return res.json({

                            message:"Khong con khach"

                        });

                    }



                    let id = result[0].id;


                    db.query(

                        `
                        UPDATE hang_doi
                        SET trang_thai='dang_phuc_vu'
                        WHERE id=?
                        `,

                        [id],


                        (err)=>{


                            if(err){
                                return res.json(err);
                            }



                            res.json({

                                message:"Dang phuc vu",

                                so_thu_tu:
                                result[0].so_thu_tu

                            });


                        }

                    );


                }

            );


        }

    );


});





// ==================================
// BO QUA SO HIEN TAI (SKIP)
// ==================================

router.put("/bo-qua",(req,res)=>{


    db.query(

        `
        UPDATE hang_doi
        SET trang_thai='bo_qua'
        WHERE trang_thai='dang_phuc_vu'
        `,


        (err)=>{


            if(err){
                return res.json(err);
            }


            res.json({

                message:"Da bo qua so"

            });


        }

    );


});





// ==================================
// GOI LAI SO BI BO QUA (BACK)
// ==================================

router.put("/goi-lai",(req,res)=>{


    db.query(

        `
        SELECT *
        FROM hang_doi
        WHERE trang_thai='bo_qua'
        ORDER BY so_lan_goi_lai ASC, so_thu_tu ASC
        LIMIT 1
        `,


        (err,result)=>{


            if(err){
                return res.json(err);
            }



            if(result.length==0){

                return res.json({

                    message:"Khong co so bo qua"

                });

            }



            let id = result[0].id;



            db.query(

                `
                UPDATE hang_doi
                SET 
                trang_thai='dang_phuc_vu',
                so_lan_goi_lai=so_lan_goi_lai+1

                WHERE id=?
                `,

                [id],


                (err)=>{


                    if(err){
                        return res.json(err);
                    }



                    res.json({

                        message:"Goi lai so",

                        so_thu_tu:
                        result[0].so_thu_tu

                    });


                }


            );


        }


    );


});





// ==================================
// XEM SO DANG PHUC VU
// ==================================

router.get("/so-hien-tai",(req,res)=>{


    db.query(

        `
        SELECT so_thu_tu
        FROM hang_doi
        WHERE trang_thai='dang_phuc_vu'
        `,


        (err,result)=>{


            if(err){
                return res.json(err);
            }


            if(result.length==0){

                return res.json({

                    so_thu_tu:0

                });

            }


            res.json({

                so_thu_tu:
                result[0].so_thu_tu

            });


        }


    );


});





// ==================================
// XEM DANH SACH CHO
// ==================================

router.get("/danh-sach",(req,res)=>{


    db.query(

        `
        SELECT *
        FROM hang_doi
        ORDER BY so_thu_tu ASC
        `,


        (err,result)=>{


            if(err){
                return res.json(err);
            }


            res.json(result);


        }

    );


});





// ==================================
// RESET CUOI NGAY
// ==================================

router.put("/reset", (req, res) => {


    db.query(

        "TRUNCATE TABLE hang_doi",


        (err)=>{


            if(err){
                return res.json(err);
            }


            res.json({

                message:"Da reset danh sach"

            });


        }

    );


});


router.get("/kiem-tra/:soThuTu", (req, res) => {

    const soThuTu = req.params.soThuTu;

    db.query(
        "SELECT trang_thai FROM hang_doi WHERE so_thu_tu=?",
        [soThuTu],
        (err, result) => {

            if (err) return res.json(err);

            if (result.length == 0) {
                return res.json({
                    trang_thai: "da_xong"
                });
            }

            res.json({
                trang_thai: result[0].trang_thai
            });

        }
    );

});

module.exports = router;
