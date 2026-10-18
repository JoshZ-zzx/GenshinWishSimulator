      // Name mappings are bundled; only the image files are requested remotely.
      // Metadata: https://github.com/theBowja/genshin-db (5.2.14).
      // Image hosts: HoYoLAB, Enka.Network, FylzX/genshinpull and the Genshin wiki.
      var REMOTE_ITEM_IMAGES = {
        "爱诺": [
                "https://enka.network/ui/UI_AvatarIcon_Aino.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Aino.png"
        ],
        "阿贝多": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Albedo.png",
                "https://enka.network/ui/UI_AvatarIcon_Albedo.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Albedo.webp"
        ],
        "艾尔海森": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Alhatham.png",
                "https://enka.network/ui/UI_AvatarIcon_Alhatham.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Alhatham.webp"
        ],
        "阿罗夏": [
                "https://enka.network/ui/UI_AvatarIcon_Alyosha.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Alyosha.png"
        ],
        "荒泷一斗": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Itto.png",
                "https://enka.network/ui/UI_AvatarIcon_Itto.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Itto.webp"
        ],
        "阿蕾奇诺": [
                "https://enka.network/ui/UI_AvatarIcon_Arlecchino.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Arlecchino.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Arlecchino.webp"
        ],
        "白术": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Baizhuer.png",
                "https://enka.network/ui/UI_AvatarIcon_Baizhuer.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Baizhuer.webp"
        ],
        "芭芭拉": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Barbara.png",
                "https://enka.network/ui/UI_AvatarIcon_Barbara.png"
        ],
        "北斗": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Beidou.png",
                "https://enka.network/ui/UI_AvatarIcon_Beidou.png"
        ],
        "班尼特": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Bennett.png",
                "https://enka.network/ui/UI_AvatarIcon_Bennett.png"
        ],
        "坎蒂丝": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Candace.png",
                "https://enka.network/ui/UI_AvatarIcon_Candace.png"
        ],
        "夏洛蒂": [
                "https://enka.network/ui/UI_AvatarIcon_Charlotte.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Charlotte.png"
        ],
        "恰斯卡": [
                "https://enka.network/ui/UI_AvatarIcon_Chasca.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Chasca.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Chasca.webp"
        ],
        "夏沃蕾": [
                "https://enka.network/ui/UI_AvatarIcon_Chevreuse.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Chevreuse.png"
        ],
        "千织": [
                "https://enka.network/ui/UI_AvatarIcon_Chiori.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Chiori.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Chiori.webp"
        ],
        "重云": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Chongyun.png",
                "https://enka.network/ui/UI_AvatarIcon_Chongyun.png"
        ],
        "茜特菈莉": [
                "https://enka.network/ui/UI_AvatarIcon_Citlali.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Citlali.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Citlali.webp"
        ],
        "克洛琳德": [
                "https://enka.network/ui/UI_AvatarIcon_Clorinde.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Clorinde.png"
        ],
        "柯莱": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Collei.png",
                "https://enka.network/ui/UI_AvatarIcon_Collei.png"
        ],
        "哥伦比娅": [
                "https://enka.network/ui/UI_AvatarIcon_Columbina.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Columbina.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Columbina.webp"
        ],
        "赛诺": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Cyno.png",
                "https://enka.network/ui/UI_AvatarIcon_Cyno.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Cyno.webp"
        ],
        "塔利雅": [
                "https://enka.network/ui/UI_AvatarIcon_Dahlia.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Dahlia.png"
        ],
        "迪希雅": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Dehya.png",
                "https://enka.network/ui/UI_AvatarIcon_Dehya.png"
        ],
        "迪卢克": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Diluc.png",
                "https://enka.network/ui/UI_AvatarIcon_Diluc.png"
        ],
        "迪奥娜": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Diona.png",
                "https://enka.network/ui/UI_AvatarIcon_Diona.png"
        ],
        "多莉": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Dori.png",
                "https://enka.network/ui/UI_AvatarIcon_Dori.png"
        ],
        "杜林": [
                "https://enka.network/ui/UI_AvatarIcon_Durin.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Durin.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Durin.webp"
        ],
        "艾梅莉埃": [
                "https://enka.network/ui/UI_AvatarIcon_Emilie.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Emilie.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Emilie.webp"
        ],
        "爱可菲": [
                "https://enka.network/ui/UI_AvatarIcon_Escoffier.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Escoffier.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Escoffier.webp"
        ],
        "优菈": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Eula.png",
                "https://enka.network/ui/UI_AvatarIcon_Eula.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Eula.webp"
        ],
        "珐露珊": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Faruzan.png",
                "https://enka.network/ui/UI_AvatarIcon_Faruzan.png"
        ],
        "菲谢尔": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Fischl.png",
                "https://enka.network/ui/UI_AvatarIcon_Fischl.png"
        ],
        "菲林斯": [
                "https://enka.network/ui/UI_AvatarIcon_Flins.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Flins.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Flins.webp"
        ],
        "菲米尼": [
                "https://enka.network/ui/UI_AvatarIcon_Freminet.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Freminet.png"
        ],
        "芙宁娜": [
                "https://enka.network/ui/UI_AvatarIcon_Furina.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Furina.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Furina.webp"
        ],
        "嘉明": [
                "https://enka.network/ui/UI_AvatarIcon_Gaming.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Gaming.png"
        ],
        "甘雨": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Ganyu.png",
                "https://enka.network/ui/UI_AvatarIcon_Ganyu.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Ganyu.webp"
        ],
        "五郎": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Gorou.png",
                "https://enka.network/ui/UI_AvatarIcon_Gorou.png"
        ],
        "胡桃": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Hutao.png",
                "https://enka.network/ui/UI_AvatarIcon_Hutao.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Hutao.webp"
        ],
        "伊安珊": [
                "https://enka.network/ui/UI_AvatarIcon_Iansan.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Iansan.png"
        ],
        "伊法": [
                "https://enka.network/ui/UI_AvatarIcon_Ifa.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Ifa.png"
        ],
        "叶洛亚": [
                "https://enka.network/ui/UI_AvatarIcon_Illuga.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Illuga.png"
        ],
        "伊涅芙": [
                "https://enka.network/ui/UI_AvatarIcon_Ineffa.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Ineffa.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Ineffa.webp"
        ],
        "雅珂达": [
                "https://enka.network/ui/UI_AvatarIcon_Jahoda.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Jahoda.png"
        ],
        "琴": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Qin.png",
                "https://enka.network/ui/UI_AvatarIcon_Qin.png"
        ],
        "卡齐娜": [
                "https://enka.network/ui/UI_AvatarIcon_Kachina.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Kachina.png"
        ],
        "枫原万叶": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Kazuha.png",
                "https://enka.network/ui/UI_AvatarIcon_Kazuha.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Kazuha.webp"
        ],
        "神里绫华": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Ayaka.png",
                "https://enka.network/ui/UI_AvatarIcon_Ayaka.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Ayaka.webp"
        ],
        "神里绫人": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Ayato.png",
                "https://enka.network/ui/UI_AvatarIcon_Ayato.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Ayato.webp"
        ],
        "卡维": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Kaveh.png",
                "https://enka.network/ui/UI_AvatarIcon_Kaveh.png"
        ],
        "刻晴": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Keqing.png",
                "https://enka.network/ui/UI_AvatarIcon_Keqing.png"
        ],
        "基尼奇": [
                "https://enka.network/ui/UI_AvatarIcon_Kinich.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Kinich.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Kinich.webp"
        ],
        "绮良良": [
                "https://enka.network/ui/UI_AvatarIcon_Momoka.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Momoka.png"
        ],
        "可莉": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Klee.png",
                "https://enka.network/ui/UI_AvatarIcon_Klee.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Klee.webp"
        ],
        "九条裟罗": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Sara.png",
                "https://enka.network/ui/UI_AvatarIcon_Sara.png"
        ],
        "久岐忍": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Shinobu.png",
                "https://enka.network/ui/UI_AvatarIcon_Shinobu.png"
        ],
        "蓝砚": [
                "https://enka.network/ui/UI_AvatarIcon_Lanyan.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Lanyan.png"
        ],
        "菈乌玛": [
                "https://enka.network/ui/UI_AvatarIcon_Lauma.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Lauma.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Lauma.webp"
        ],
        "莱依拉": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Layla.png",
                "https://enka.network/ui/UI_AvatarIcon_Layla.png"
        ],
        "莉奈娅": [
                "https://enka.network/ui/UI_AvatarIcon_Linnea.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Linnea.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Linnea.webp"
        ],
        "洛恩": [
                "https://enka.network/ui/UI_AvatarIcon_Lohen.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Lohen.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Lohen.webp"
        ],
        "琳妮特": [
                "https://enka.network/ui/UI_AvatarIcon_Linette.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Linette.png"
        ],
        "林尼": [
                "https://enka.network/ui/UI_AvatarIcon_Liney.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Liney.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Liney.webp"
        ],
        "玛薇卡": [
                "https://enka.network/ui/UI_AvatarIcon_Mavuika.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Mavuika.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Mavuika.webp"
        ],
        "米卡": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Mika.png",
                "https://enka.network/ui/UI_AvatarIcon_Mika.png"
        ],
        "莫娜": [
                "https://enka.network/ui/UI_AvatarIcon_Mona.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Mona.png"
        ],
        "玛拉妮": [
                "https://enka.network/ui/UI_AvatarIcon_Mualani.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Mualani.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Mualani.webp"
        ],
        "纳西妲": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Nahida.png",
                "https://enka.network/ui/UI_AvatarIcon_Nahida.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Nahida.webp"
        ],
        "娜维娅": [
                "https://enka.network/ui/UI_AvatarIcon_Navia.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Navia.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Navia.webp"
        ],
        "奈芙尔": [
                "https://enka.network/ui/UI_AvatarIcon_Nefer.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Nefer.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Nefer.webp"
        ],
        "那维莱特": [
                "https://enka.network/ui/UI_AvatarIcon_Neuvillette.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Neuvillette.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Neuvillette.webp"
        ],
        "尼可": [
                "https://enka.network/ui/UI_AvatarIcon_Nicole.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Nicole.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Nicole.webp"
        ],
        "妮露": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Nilou.png",
                "https://enka.network/ui/UI_AvatarIcon_Nilou.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Nilou.webp"
        ],
        "凝光": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Ningguang.png",
                "https://enka.network/ui/UI_AvatarIcon_Ningguang.png"
        ],
        "诺艾尔": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Noel.png",
                "https://enka.network/ui/UI_AvatarIcon_Noel.png"
        ],
        "奥黛塔": [
                "https://enka.network/ui/UI_AvatarIcon_Odette.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Odette.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Odette.webp"
        ],
        "欧洛伦": [
                "https://enka.network/ui/UI_AvatarIcon_Olorun.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Olorun.png"
        ],
        "布伦妮": [
                "https://enka.network/ui/UI_AvatarIcon_Prune.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Prune.png"
        ],
        "七七": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Qiqi.png",
                "https://enka.network/ui/UI_AvatarIcon_Qiqi.png"
        ],
        "雷电将军": [
                "https://enka.network/ui/UI_AvatarIcon_Shougun.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Shougun.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Shougun.webp"
        ],
        "雷泽": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Razor.png",
                "https://enka.network/ui/UI_AvatarIcon_Razor.png"
        ],
        "罗莎莉亚": [
                "https://enka.network/ui/UI_AvatarIcon_Rosaria.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Rosaria.png"
        ],
        "桑多涅": [
                "https://enka.network/ui/UI_AvatarIcon_MarionetteNew.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_MarionetteNew.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Sandrone.webp"
        ],
        "珊瑚宫心海": [
                "https://enka.network/ui/UI_AvatarIcon_Kokomi.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Kokomi.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Kokomi.webp"
        ],
        "早柚": [
                "https://enka.network/ui/UI_AvatarIcon_Sayu.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Sayu.png"
        ],
        "赛索斯": [
                "https://enka.network/ui/UI_AvatarIcon_Sethos.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Sethos.png"
        ],
        "申鹤": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Shenhe.png",
                "https://enka.network/ui/UI_AvatarIcon_Shenhe.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Shenhe.webp"
        ],
        "鹿野院平藏": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Heizo.png",
                "https://enka.network/ui/UI_AvatarIcon_Heizo.png"
        ],
        "希格雯": [
                "https://enka.network/ui/UI_AvatarIcon_Sigewinne.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Sigewinne.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Sigewinne.webp"
        ],
        "丝柯克": [
                "https://enka.network/ui/UI_AvatarIcon_SkirkNew.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_SkirkNew.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Skirk.webp"
        ],
        "砂糖": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Sucrose.png",
                "https://enka.network/ui/UI_AvatarIcon_Sucrose.png"
        ],
        "达达利亚": [
                "https://enka.network/ui/UI_AvatarIcon_Tartaglia.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Tartaglia.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Tartaglia.webp"
        ],
        "托马": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Tohma.png",
                "https://enka.network/ui/UI_AvatarIcon_Tohma.png"
        ],
        "提纳里": [
                "https://enka.network/ui/UI_AvatarIcon_Tighnari.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Tighnari.png"
        ],
        "瓦雷莎": [
                "https://enka.network/ui/UI_AvatarIcon_Varesa.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Varesa.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Varesa.webp"
        ],
        "法尔伽": [
                "https://enka.network/ui/UI_AvatarIcon_Varka.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Varka.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Varka.webp"
        ],
        "温迪": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Venti.png",
                "https://enka.network/ui/UI_AvatarIcon_Venti.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Venti.webp"
        ],
        "薇斯纳": [
                "https://enka.network/ui/UI_AvatarIcon_Vesna.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Vesna.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Vesna.webp"
        ],
        "沃雅妮莎": [
                "https://enka.network/ui/UI_AvatarIcon_Vodyanitsa.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Vodyanitsa.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Vodyanitsa.webp"
        ],
        "流浪者": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Wanderer.png",
                "https://enka.network/ui/UI_AvatarIcon_Wanderer.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Wanderer.webp"
        ],
        "莱欧斯利": [
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Wriothesley.webp",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Wriothesley.png",
                "https://enka.network/ui/UI_AvatarIcon_Wriothesley.png"
        ],
        "香菱": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Xiangling.png",
                "https://enka.network/ui/UI_AvatarIcon_Xiangling.png"
        ],
        "闲云": [
                "https://enka.network/ui/UI_AvatarIcon_Liuyun.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Liuyun.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Liuyun.webp"
        ],
        "魈": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Xiao.png",
                "https://enka.network/ui/UI_AvatarIcon_Xiao.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Xiao.webp"
        ],
        "希诺宁": [
                "https://enka.network/ui/UI_AvatarIcon_Xilonen.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Xilonen.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Xilonen.webp"
        ],
        "行秋": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Xingqiu.png",
                "https://enka.network/ui/UI_AvatarIcon_Xingqiu.png"
        ],
        "辛焱": [
                "https://enka.network/ui/UI_AvatarIcon_Xinyan.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Xinyan.png"
        ],
        "八重神子": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Yae.png",
                "https://enka.network/ui/UI_AvatarIcon_Yae.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Yae.webp"
        ],
        "烟绯": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Feiyan.png",
                "https://enka.network/ui/UI_AvatarIcon_Feiyan.png"
        ],
        "瑶瑶": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Yaoyao.png",
                "https://enka.network/ui/UI_AvatarIcon_Yaoyao.png"
        ],
        "夜兰": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Yelan.png",
                "https://enka.network/ui/UI_AvatarIcon_Yelan.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Yelan.webp"
        ],
        "宵宫": [
                "https://enka.network/ui/UI_AvatarIcon_Yoimiya.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Yoimiya.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Yoimiya.webp"
        ],
        "梦见月瑞希": [
                "https://enka.network/ui/UI_AvatarIcon_Mizuki.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Mizuki.png"
        ],
        "云堇": [
                "https://enka.network/ui/UI_AvatarIcon_Yunjin.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Yunjin.png"
        ],
        "钟离": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Zhongli.png",
                "https://enka.network/ui/UI_AvatarIcon_Zhongli.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Zhongli.webp"
        ],
        "兹白": [
                "https://enka.network/ui/UI_AvatarIcon_Zibai.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/character_icon/UI_AvatarIcon_Zibai.png",
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/AvatarIcon/UI_AvatarIcon_Zibai.webp"
        ],
        "黑缨枪": [
                "https://enka.network/ui/UI_EquipIcon_Pole_Noire.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Noire.png"
        ],
        "沐浴龙血的剑": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Siegfry.png",
                "https://enka.network/ui/UI_EquipIcon_Claymore_Siegfry.png"
        ],
        "冷刃": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Steel.png",
                "https://enka.network/ui/UI_EquipIcon_Sword_Steel.png"
        ],
        "以理服人": [
                "https://enka.network/ui/UI_EquipIcon_Claymore_Reasoning.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Reasoning.png"
        ],
        "匣里灭辰": [
                "https://enka.network/ui/UI_EquipIcon_Pole_Stardust.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Stardust.png"
        ],
        "翡玉法球": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Jade.png",
                "https://enka.network/ui/UI_EquipIcon_Catalyst_Jade.png"
        ],
        "昭心": [
                "https://enka.network/ui/UI_EquipIcon_Catalyst_Truelens.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Truelens.png"
        ],
        "西风秘典": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Zephyrus.png",
                "https://enka.network/ui/UI_EquipIcon_Catalyst_Zephyrus.png"
        ],
        "西风大剑": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Zephyrus.png",
                "https://enka.network/ui/UI_EquipIcon_Claymore_Zephyrus.png"
        ],
        "西风长枪": [
                "https://enka.network/ui/UI_EquipIcon_Pole_Zephyrus.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Pole_Zephyrus.png"
        ],
        "西风剑": [
                "https://enka.network/ui/UI_EquipIcon_Sword_Zephyrus.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Zephyrus.png"
        ],
        "西风猎弓": [
                "https://enka.network/ui/UI_EquipIcon_Bow_Zephyrus.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Zephyrus.png"
        ],
        "铁影阔剑": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Glaive.png",
                "https://enka.network/ui/UI_EquipIcon_Claymore_Glaive.png"
        ],
        "黎明神剑": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Dawn.png",
                "https://enka.network/ui/UI_EquipIcon_Sword_Dawn.png"
        ],
        "匣里龙吟": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Rockkiller.png",
                "https://enka.network/ui/UI_EquipIcon_Sword_Rockkiller.png"
        ],
        "魔导绪论": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Intro.png",
                "https://enka.network/ui/UI_EquipIcon_Catalyst_Intro.png"
        ],
        "雨裁": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Perdue.png",
                "https://enka.network/ui/UI_EquipIcon_Claymore_Perdue.png"
        ],
        "鸦羽弓": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Crowfeather.png",
                "https://enka.network/ui/UI_EquipIcon_Bow_Crowfeather.png"
        ],
        "弓藏": [
                "https://enka.network/ui/UI_EquipIcon_Bow_Recluse.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Recluse.png"
        ],
        "祭礼弓": [
                "https://enka.network/ui/UI_EquipIcon_Bow_Fossil.png",
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Fossil.png"
        ],
        "祭礼残章": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Fossil.png",
                "https://enka.network/ui/UI_EquipIcon_Catalyst_Fossil.png"
        ],
        "祭礼大剑": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Fossil.png",
                "https://enka.network/ui/UI_EquipIcon_Claymore_Fossil.png"
        ],
        "祭礼剑": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Fossil.png",
                "https://enka.network/ui/UI_EquipIcon_Sword_Fossil.png"
        ],
        "神射手之誓": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Arjuna.png",
                "https://enka.network/ui/UI_EquipIcon_Bow_Arjuna.png"
        ],
        "飞天御剑": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Mitsurugi.png",
                "https://enka.network/ui/UI_EquipIcon_Sword_Mitsurugi.png"
        ],
        "弹弓": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Sling.png",
                "https://enka.network/ui/UI_EquipIcon_Bow_Sling.png"
        ],
        "钟剑": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Claymore_Troupe.png",
                "https://enka.network/ui/UI_EquipIcon_Claymore_Troupe.png"
        ],
        "笛剑": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Sword_Troupe.png",
                "https://enka.network/ui/UI_EquipIcon_Sword_Troupe.png"
        ],
        "绝弦": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Bow_Troupe.png",
                "https://enka.network/ui/UI_EquipIcon_Bow_Troupe.png"
        ],
        "流浪乐章": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Troupe.png",
                "https://enka.network/ui/UI_EquipIcon_Catalyst_Troupe.png"
        ],
        "讨龙英杰谭": [
                "https://upload-os-bbs.mihoyo.com/game_record/genshin/equip/UI_EquipIcon_Catalyst_Pulpfic.png",
                "https://enka.network/ui/UI_EquipIcon_Catalyst_Pulpfic.png"
        ]
};
      var REMOTE_ELEMENT_IMAGES = {
        "风": [
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/elements/anemo.webp",
                "https://static.wikia.nocookie.net/gensin-impact/images/a/a4/Element_Anemo.png"
        ],
        "岩": [
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/elements/geo.webp",
                "https://static.wikia.nocookie.net/gensin-impact/images/4/4a/Element_Geo.png"
        ],
        "雷": [
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/elements/electro.webp",
                "https://static.wikia.nocookie.net/gensin-impact/images/7/73/Element_Electro.png"
        ],
        "草": [
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/elements/dendro.webp",
                "https://static.wikia.nocookie.net/gensin-impact/images/f/f4/Element_Dendro.png"
        ],
        "水": [
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/elements/hydro.webp",
                "https://static.wikia.nocookie.net/gensin-impact/images/3/35/Element_Hydro.png"
        ],
        "火": [
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/elements/pyro.webp",
                "https://static.wikia.nocookie.net/gensin-impact/images/e/e8/Element_Pyro.png"
        ],
        "冰": [
                "https://raw.githubusercontent.com/FylzX/genshinpull/main/public/elements/cryo.webp",
                "https://static.wikia.nocookie.net/gensin-impact/images/8/88/Element_Cryo.png"
        ]
};

