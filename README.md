# PCA (2D/3D) Plot

### 설치 및 실행
- git 설치
- nodeJS 설치
- git clone https://github.com/subji/pcaplot-for-bio.git 
- git 에서 복사한 디렉토리로 이동
- 커맨드 라인에서 npm install 실행
- 커맨드 라인에서 node bin/www or npm install -g nodemon 후 nodemon bin/www 실행
- 실행 후 웹 페이지에서 http://localhost:3000 실행

### 데이터 입력 및 포맷
- public/datas 디렉토리에 'PCA.dat.tsv' 이름으로 데이터를 넣는다.
- data format 은 다음과 같다.
```
	"SAMPLE"	"TYPE"	"PC1"	"PC2"	"PC3"	"PC4"	"PC5"	"PC6"	"PC7"	"PC8"	"PC9"	"PC10"
"TCGA-06-0129-01A"	"Primary Solid Tumor"	-67.6864301426578	65.5050575980508	-90.0719877736362	-19.1353807434997	32.1618007286351	-4.40681850390464	-3.57075872433012	1.57551280285369	1.74240775256913	-2.58085870383229e-13
```


