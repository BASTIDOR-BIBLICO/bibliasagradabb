// Mock chapter data — replace with Supabase / API later.
// Translation: Almeida Revista e Corrigida (domínio público).

export interface Verse {
  number: number;
  text: string;
}

export interface ChapterData {
  bookId: string;
  chapter: number;
  verses: Verse[];
}

const genesis1: ChapterData = {
  bookId: "genesis",
  chapter: 1,
  verses: [
    { number: 1, text: "No princípio criou Deus os céus e a terra." },
    { number: 2, text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo; e o Espírito de Deus se movia sobre a face das águas." },
    { number: 3, text: "E disse Deus: Haja luz. E houve luz." },
    { number: 4, text: "E viu Deus que era boa a luz; e fez Deus separação entre a luz e as trevas." },
    { number: 5, text: "E Deus chamou à luz Dia; e às trevas chamou Noite. E foi a tarde e a manhã, o dia primeiro." },
    { number: 6, text: "E disse Deus: Haja uma expansão no meio das águas, e haja separação entre águas e águas." },
    { number: 7, text: "E fez Deus a expansão, e fez separação entre as águas que estavam debaixo da expansão e as águas que estavam sobre a expansão; e assim foi." },
    { number: 8, text: "E chamou Deus à expansão Céus; e foi a tarde e a manhã, o dia segundo." },
    { number: 9, text: "E disse Deus: Ajuntem-se as águas debaixo dos céus num lugar; e apareça a porção seca; e assim foi." },
    { number: 10, text: "E chamou Deus à porção seca Terra; e ao ajuntamento das águas chamou Mares; e viu Deus que era bom." },
    { number: 11, text: "E disse Deus: Produza a terra erva verde, erva que dê semente, árvore frutífera que dê fruto segundo a sua espécie, cuja semente está nela sobre a terra; e assim foi." },
    { number: 12, text: "E a terra produziu erva, erva dando semente conforme a sua espécie, e a árvore frutífera, cuja semente está nela conforme a sua espécie; e viu Deus que era bom." },
    { number: 13, text: "E foi a tarde e a manhã, o dia terceiro." },
    { number: 14, text: "E disse Deus: Haja luminares na expansão dos céus, para haver separação entre o dia e a noite; e sejam eles para sinais e para tempos determinados e para dias e anos." },
    { number: 15, text: "E sejam para luminares na expansão dos céus, para iluminar a terra; e assim foi." },
    { number: 16, text: "E fez Deus os dois grandes luminares: o luminar maior para governar o dia, e o luminar menor para governar a noite; e fez as estrelas." },
    { number: 17, text: "E Deus os pôs na expansão dos céus para iluminar a terra," },
    { number: 18, text: "e para governar o dia e a noite, e para fazer separação entre a luz e as trevas; e viu Deus que era bom." },
    { number: 19, text: "E foi a tarde e a manhã, o dia quarto." },
    { number: 20, text: "E disse Deus: Produzam as águas abundantemente répteis de alma vivente; e voem as aves sobre a face da expansão dos céus." },
    { number: 21, text: "E Deus criou as grandes baleias, e todo o réptil de alma vivente que as águas abundantemente produziram conforme as suas espécies; e toda a ave de asas conforme a sua espécie; e viu Deus que era bom." },
    { number: 22, text: "E Deus os abençoou, dizendo: Frutificai e multiplicai-vos, e enchei as águas nos mares; e as aves se multipliquem na terra." },
    { number: 23, text: "E foi a tarde e a manhã, o dia quinto." },
    { number: 24, text: "E disse Deus: Produza a terra alma vivente conforme a sua espécie; gado, e répteis e feras da terra conforme a sua espécie; e assim foi." },
    { number: 25, text: "E fez Deus as feras da terra conforme a sua espécie, e o gado conforme a sua espécie, e todo o réptil da terra conforme a sua espécie; e viu Deus que era bom." },
    { number: 26, text: "E disse Deus: Façamos o homem à nossa imagem, conforme a nossa semelhança; e domine sobre os peixes do mar, e sobre as aves dos céus, e sobre o gado, e sobre toda a terra, e sobre todo o réptil que se move sobre a terra." },
    { number: 27, text: "E criou Deus o homem à sua imagem; à imagem de Deus o criou; macho e fêmea os criou." },
    { number: 28, text: "E Deus os abençoou, e Deus lhes disse: Frutificai e multiplicai-vos, e enchei a terra, e sujeitai-a; e dominai sobre os peixes do mar e sobre as aves dos céus, e sobre todo o animal que se move sobre a terra." },
    { number: 29, text: "E disse Deus: Eis que vos tenho dado toda a erva que dê semente, que está sobre a face de toda a terra; e toda a árvore, em que há fruto que dê semente, ser-vos-á para mantimento." },
    { number: 30, text: "E a todo o animal da terra, e a toda a ave dos céus, e a todo o réptil da terra, em que há alma vivente, toda a erva verde lhes será para mantimento; e assim foi." },
    { number: 31, text: "E viu Deus tudo quanto tinha feito, e eis que era muito bom; e foi a tarde e a manhã, o dia sexto." },
  ],
};

const joao1: ChapterData = {
  bookId: "joao",
  chapter: 1,
  verses: [
    { number: 1, text: "No princípio era o Verbo, e o Verbo estava com Deus, e o Verbo era Deus." },
    { number: 2, text: "Ele estava no princípio com Deus." },
    { number: 3, text: "Todas as coisas foram feitas por ele, e sem ele nada do que foi feito se fez." },
    { number: 4, text: "Nele estava a vida, e a vida era a luz dos homens;" },
    { number: 5, text: "e a luz resplandece nas trevas, e as trevas não a compreenderam." },
    { number: 6, text: "Houve um homem enviado de Deus, cujo nome era João." },
    { number: 7, text: "Este veio para testemunho, para que testificasse da luz, para que todos cressem por ele." },
    { number: 8, text: "Não era ele a luz, mas para que testificasse da luz." },
    { number: 9, text: "Ali estava a luz verdadeira, que ilumina a todo o homem que vem ao mundo." },
    { number: 10, text: "Estava no mundo, e o mundo foi feito por ele, e o mundo não o conheceu." },
    { number: 11, text: "Veio para o que era seu, e os seus não o receberam." },
    { number: 12, text: "Mas, a todos quantos o receberam, deu-lhes o poder de serem feitos filhos de Deus, aos que crêem no seu nome;" },
    { number: 13, text: "os quais não nasceram do sangue, nem da vontade da carne, nem da vontade do varão, mas de Deus." },
    { number: 14, text: "E o Verbo se fez carne, e habitou entre nós, e vimos a sua glória, como a glória do unigênito do Pai, cheio de graça e de verdade." },
    { number: 15, text: "João testificou dele, e clamou, dizendo: Este era aquele de quem eu dizia: O que vem depois de mim é antes de mim, porque foi primeiro do que eu." },
    { number: 16, text: "E todos nós recebemos também da sua plenitude, e graça por graça." },
    { number: 17, text: "Porque a lei foi dada por Moisés; a graça e a verdade vieram por Jesus Cristo." },
    { number: 18, text: "Deus nunca foi visto por alguém. O Filho unigênito, que está no seio do Pai, esse o fez conhecer." },
  ],
};

const MOCK: Record<string, ChapterData> = {
  "genesis-1": genesis1,
  "joao-1": joao1,
};

export function getChapter(bookId: string, chapter: number): ChapterData {
  const key = `${bookId}-${chapter}`;
  if (MOCK[key]) return MOCK[key];
  // Fallback placeholder for chapters not in the mock yet.
  return {
    bookId,
    chapter,
    verses: [
      {
        number: 1,
        text: "Conteúdo deste capítulo ainda não está disponível no MVP. Em breve a leitura completa será integrada via Lovable Cloud.",
      },
    ],
  };
}
