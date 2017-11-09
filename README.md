# PCA (2D/3D) Plot
### installation & run

먼저 git 과 nodejs & npm 이 설치되어 있어야 한다.

- git clone https://github.com/subji/pcaplot-for-bio.git 
- cd directory
- npm install
- node bin/www or npm install -g nodemon 후 nodemon bin/www 실행
- http://localhost:3000 <- 3000 은 
	bin 안에 www 에서 8000 을 3000 으로 변경하면 된다.

### data
- cd public/datas
- input data
- 단 현재 파일명은 'PCA.dat.tsv' 으로 해야 한다.
- 2d의 경우 pca2d 를 주석해제 후 사용,
  3d의 경우 pca3d 를 주석해제 후 사용한다.
- data format: (tsv)
	ex) 
	"SAMPLE"	"TYPE"	"PC1"	"PC2"	"PC3"	"PC4"	"PC5"	"PC6"	"PC7"	"PC8"	"PC9"	"PC10"
"TCGA-06-0129-01A"	"Primary Solid Tumor"	-67.6864301426578	65.5050575980508	-90.0719877736362	-19.1353807434997	32.1618007286351	-4.40681850390464	-3.57075872433012	1.57551280285369	1.74240775256913	-2.58085870383229e-13

