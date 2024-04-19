#import "template.typ": *

#let titulo = [React + React Router + json-server: Um Website Sobre Venda de Livros]
#let subtitulo = [Projeto realizado no âmbito da Unidade Curricular de \ Projetos em Ambientes Web e Cloud]
#let indice= false
// TODO change to grid
// let versao
// let data
// let autores para ter for loop
#set align(center)
#set page(
  margin: (x: 3cm, y: 2.5cm),
)
#set text(
  hyphenate: false
)
#set par(
  first-line-indent: 0pt,
  justify: false,
)
#par(leading: 0.15cm)[
  #show: smallcaps

  #text(13pt)[ISCTE-IUL] \
  #text(12.5pt)[Licenciatura em Ciência de Dados]
]
#v(0.1cm)
#line(length: 100%, stroke: 0.5pt)

#v(0.4cm)
#par(leading: 0.22cm)[
  #text(28pt)[#titulo]
  #linebreak()
  #v(0.1cm)
  #text(16pt)[#subtitulo]
]
#v(0.4cm)
#line(length: 100%, stroke: 1pt)
#if indice {
  v(0.4cm)
} else {
  v(3cm)
}
#par(leading: 0.3cm)[
  #text(20pt)[Allan Kardec Rodrigues, 103380]\
  #link("mailto:aksrs@iscte-iul.pt")
  #v(0.12cm)
  #text(20pt)[André Plancha, 105289]\
  #link("mailto:Andre_Plancha@iscte-iul.pt")[Andre_Plancha\@iscte-iul.pt]\
  #v(4cm)
]
#if indice {
  v(2cm)
} else {
  v(4.5cm)
}
#par(leading: 0.12cm)[
  #text(16pt)[Abril de 2024]\
  #text(16pt)[Versão 1.0.0]
]
#v(3cm)
#set align(left)
// #outline(
//   title: text(weight: 600)[Índice],
//   fill: text(15pt, spacing: 220%)[#repeat(" . ")]
// )