var express = require('express');
var router = express.Router();

var connection = require('../library/database');

router.get('/', function (req, res, next) {
  connection.query('SELECT * FROM akun ORDER BY id desc', function (err, rows) {
    if (err) {
      req.flash('error', err);
      res.render('posts', {
        data: ''
      });
    } else {
      res.render('posts/index', {
        data: rows
      });
    }
  });
});

// Create
router.get('/create', function (req, res, next) {
  res.render('posts/create', {
    full_name: '',
    jurusan: '',
    tahun_lulus: ''
  });
});

// Store
router.post('/store', function (req, res, next) {
  let full_name = req.body.full_name;
  let jurusan = req.body.jurusan;
  let tahun_lulus = req.body.tahun_lulus;
  let errors = false;

  if (full_name.length === 0) {
    errors = true;
    req.flash('error', "Silahkan masukkan Nama");
    res.render('posts/create', {
      full_name: full_name,
      jurusan: jurusan,
      tahun_lulus: tahun_lulus
    });
  }

  if (jurusan.length === 0) {
    errors = true;
    req.flash('error', "Silahkan masukkan jurusan");
    res.render('posts/create', {
      full_name: full_name,
      jurusan: jurusan,
      tahun_lulus: tahun_lulus
    });
  }

  if (tahun_lulus.length === 0) {
    errors = true;
    req.flash('error', "Silahkan masukkan tahun lulus");
    res.render('posts/create', {
      full_name: full_name,
      jurusan: jurusan,
      tahun_lulus: tahun_lulus
    });
  }

  if (!errors) {
    let formData = {
      full_name: full_name,
      jurusan: jurusan,
      tahun_lulus: tahun_lulus
    }

    connection.query('INSERT INTO akun SET ?', formData, function (err, results) {
      if (err) {
        req.flash('error', err);

        res.render('posts/create', {
          full_name: formData.full_name,
          jurusan: formData.jurusan,
          tahun_lulus: formData.tahun_lulus
        });
      } else {
        req.flash('success', 'Data Berhasil Disimpan');
        res.redirect('/posts');
      }
    });
  }
});

// Edit
router.get('/edit/(:id)', function (req, res, next) {
  let id = req.params.id;

  connection.query('SELECT * FROM akun WHERE id = ' + id, function (err, rows, fields) {
    if (err) throw err;

    if (rows.length <= 0) {
      req.flash('error', 'Data POST dengan ID ' + id, " Tidak Ditemukan");
      res.redirect('/posts')
    }
    else {
      res.render('posts/edit', {
        id: rows[0].id,
        full_name: rows[0].full_name,
        jurusan: rows[0].jurusan,
        tahun_lulus: rows[0].tahun_lulus
      });
    }
  });
});

// Update
router.post('/update/:id', function (req, res, next) {
  let id = req.params.id;
  let full_name = req.body.full_name;
  let jurusan = req.body.jurusan;
  let tahun_lulus = req.body.tahun_lulus;
  let errors = false;

  if (full_name.length === 0) {
    errors = true;
    req.flash('error', "Silahkan Masukkan Nama");
    res.render('posts/edit', {
      id: req.params.id,
      full_name: full_name,
      jurusan: jurusan,
      tahun_lulus: tahun_lulus
    });
  }

  if (jurusan.length === 0) {
    errors = true;
    req.flash('error', "Silahkan Masukkan jurusan");
    res.render('posts/edit', {
      id: req.params.id,
      full_name: full_name,
      jurusan: jurusan,
      tahun_lulus: tahun_lulus
    });
  }

  if (tahun_lulus.length === 0) {
    errors = true;
    req.flash('error', "Silahkan Masukkan tahun lulus");
    res.render('posts/edit', {
      id: req.params.id,
      full_name: full_name,
      jurusan: jurusan,
      tahun_lulus: tahun_lulus
    });
  }

  if (!errors) {
    let formData = {
      full_name: full_name,
      jurusan: jurusan,
      tahun_lulus: tahun_lulus
    }

    connection.query('UPDATE akun SET ? WHERE id = ' + id, formData, function (err, results) {
      if (err) {
        req.flash('error', err);
        res.render('posts/edit', {
          id: req.params.id,
          full_name: formData.full_name,
          jurusan: formData.jurusan,
          tahun_lulus: formData.tahun_lulus
        });
      } else {
        req.flash('success', "Data berhasil di update!");
        res.redirect('/posts');
      }
    });
  }
});

// Delete
router.get('/delete/(:id)', function (req, res, next) {
  let id = req.params.id;

  connection.query('DELETE FROM akun WHERE id = ' + id, function (err, result) {
    if (err) {
      req.flash('error', err);
      res.redirect('/posts');
    } else {
      req.flash('success', "Data berhasil dihapus");
      res.redirect('/posts');
    }
  });
});

module.exports = router;