$.ajax({
  url: "absensi.online.php",
  type: "GET",
  data: {
    ABSENSI: {
      IN_NIM: 195150300111015,
      IN_IS_AKTIF: $("#is_aktif").val(),
    },
  },
  success: function (res) {
    var result = JSON.parse(res);
    console.log(result);
    var str = "";
    var tgl_bts = "";
    var kehadiran = "";
    str += "<thead>";
    str +=
      '<tr class="textWhite" style="color:white" bgcolor="#000000" align="center">';
    str +=
      '<td width="60%"><div align="center">Mata Kuliah / Materi / Catatan</div></td>';
    str += '<td width="20%"><div align="center">Batas Presensi</div></td>';
    str += '<td width="20%"><div align="center">Kehadiran</div></td>';
    str += "</tr>";
    str += "</thead>";
    str += "<tbody>";
    if (result.length != 0) {
      for (var i = 0; i < result.length; i++) {
        str += "<tr>";
        result[i].keterangan = result[i].keterangan.replace(
          /(\r\n|\n|\r)/gm,
          "<br>"
        );
        str +=
          '<td><b style="color:blue">' +
          result[i].mata_kuliah +
          " (" +
          result[i].kelas +
          ")" +
          "</b><br><br><b>Materi :</b><br>" +
          result[i].materi +
          "<br><br><b>Catatan :</b><br>" +
          result[i].keterangan +
          "</td>";
        //tgl_bts = result[i].waktu_tutup.substring(0,10);
        //tgl_bts = new Date(tgl_bts);
        //tgl_bts = tgl_bts.setDate(tgl_bts.getDate() - 1);

        //new_tgl_bts = new Date(tgl_bts);
        //var bulan = new_tgl_bts.getMonth() + 1;
        //console.log(new_tgl_bts);
        //str += '<td style="text-align:center">'+new_tgl_bts.getFullYear()+'-'+bulan+'-'+new_tgl_bts.getDate()+' 23:59 WIB</td>';

        str +=
          '<td style="text-align:center">' +
          result[i].waktu_tutup.substring(0, 19) +
          " WIB</td>";

        str += '<td style="text-align:center">';
        if (result[i].is_aktif == "0") {
          if (result[i].k_absensi == "") {
            str +=
              '<button class="hadir" onclick="rekamAbsensi(\'' +
              btoa(JSON.stringify(result[i])) +
              "','H')\">HADIR LURING</button><br>";
            str +=
              '<button class="hadir1" onclick="rekamAbsensi(\'' +
              btoa(JSON.stringify(result[i])) +
              "','H1')\">HADIR DARING</button><br>";
            str +=
              '<button class="izin" onclick="rekamAbsensi(\'' +
              btoa(JSON.stringify(result[i])) +
              "','I')\">IZIN</button><br>";
            str +=
              '<button class="sakit" onclick="rekamAbsensi(\'' +
              btoa(JSON.stringify(result[i])) +
              "','S')\">SAKIT</button><br>";
          } else {
            if (result[i].k_absensi == "H") {
              if (result[i].is_daring == "1") {
                kehadiran = "HADIR (Daring)";
              } else {
                kehadiran = "HADIR (Luring)";
              }
            } else if (result[i].k_absensi == "I") {
              kehadiran = "IZIN";
            } else if (result[i].k_absensi == "S") {
              kehadiran = "SAKIT";
            } else if (result[i].k_absensi == "A") {
              kehadiran = '<span style="color:red">ALPHA</span>';
            }
            str += kehadiran;
          }
        } else {
          str += "KEHADIRAN TIDAK TEREKAM";
        }

        str += "</td>";
        str += "</tr>";
      }
    } else {
      var str =
        '<tr><td colspan="4">Tidak ada data untuk ditampilkan Nihh</td></tr>';
    }
    str += "</tbody>";
    $("#absensi").html(str);
  },
});
