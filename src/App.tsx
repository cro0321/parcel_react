import { useEffect, useState } from "react";
import { Interface } from "readline";

interface Company {
  International: string,
  Code: string,
  Name: string
}


interface ThemeColor {
  // 중첩 객체에서는 번호가 아니라 배열 대괄호의 이름임 ex themeColor['blue'].text 이런 방식이라 배열이기 때문에 key값이 string이다.
    // 중첩 객체에서는 index값을 못씀 
[key:string] : {
  back:string
  hover:string
  active:string
  text:string

}

}

function App() {
  // const [test, setTest] = useState<string>();
  //모든데이터
  const [allCarriers, setAllCarriers] = useState<Company>();
  // 필터되는 데이터
  const [carriers, setCarriers] = useState<Company[]>([]);
  const [theme, setTheme] = useState<string>('default');
  // 04대한통운을 기본으로 택배사 코드
  const [tcode, setTcode] = useState<string>('04');
  // 실제 운송장 번호
  const [tinvoice, setTinvoice] = useState<string>('');
  //택배사 이름
  const [tname, setTname] = useState<string>('CJ대한통운');

  const themeColor : ThemeColor = {
    "default": {
      "back": "bg-indigo-500",
      "hover": "hover:bg-indigo-300",
      "active" : "bg-indigo-400",
      "text" : "text-indigo-500"
    },
    "orange": {
      "back": "bg-orange-500",
      "hover": "hover:bg-orange-300",
      "active" : "bg-orange-400",
      "text" : "text-orange-500"
    },
    "blue": {
      "back": "bg-blue-500",
      "hover": "hover:bg-blue-300",
      "active" : "bg-blue-400",
      "text" : "text-blue-500"
    }
  }



  return (
    <>
    <p>{themeColor[theme] && themeColor["blue"].back}</p>
      <p className="text-green-400 bg-red-400 text-lg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti hic ipsum in quas explicabo, minima perspiciatis, aliquam recusandae fugit temporibus placeat nesciunt magni ullam consectetur provident veritatis tenetur, ducimus esse illo ut dolore animi autem. Similique eaque magni deleniti, porro quibusdam optio neque quo, explicabo veritatis numquam minima suscipit omnis quas maxime voluptatibus quisquam tenetur impedit aliquam a nostrum et! Corrupti quis ad omnis molestiae, vero temporibus aut ipsa quos ea animi aliquam labore nesciunt! Qui fuga repudiandae velit modi, voluptatum saepe aperiam? Autem ullam et id iusto eligendi commodi? Itaque alias quisquam labore in id similique illum? Porro doloribus fugiat odit accusantium mollitia sit! Ratione ipsum nemo asperiores nobis ullam, et vero minima numquam, natus veniam quod dolore, incidunt iure? Itaque quis iste dicta, cum magni quas sed officia obcaecati eius aliquam corrupti sunt illum odit architecto, id exercitationem alias voluptate quo placeat neque? Quas ad aspernatur fugiat, similique porro sit blanditiis, animi, nulla voluptatum repudiandae inventore nostrum assumenda libero dolore ea sint non necessitatibus? Sint ipsum totam ducimus praesentium id dicta quidem? Provident eum vitae tempora nesciunt dolores nobis rerum voluptas molestiae nam repudiandae placeat, distinctio nihil ad id! Odit ipsam reiciendis dolorem architecto, quas cumque minima unde repudiandae iure illum. Quam maiores quis animi asperiores, excepturi aperiam quisquam, saepe quaerat impedit aspernatur nulla, voluptatum commodi eligendi? Illum ad soluta doloribus magnam porro vel consectetur quisquam ducimus, adipisci quaerat cumque fugiat similique beatae optio est vitae quam libero corrupti! Aspernatur accusantium natus praesentium rerum. Deserunt provident voluptate cupiditate neque corporis. Quod ratione debitis perspiciatis sunt. Vel omnis est aliquid cum alias laudantium, facere similique vitae explicabo nam animi ut totam adipisci ducimus nostrum dicta neque impedit veniam? Necessitatibus nihil modi perferendis praesentium id, fuga suscipit ut aperiam molestias officia dolorem reprehenderit ullam provident exercitationem velit repellat earum eaque error atque? Inventore corporis dolorem unde autem excepturi, animi similique blanditiis accusantium rem quisquam hic aliquam porro expedita iusto eius velit dolor at, quidem libero atque, ullam placeat asperiores eveniet mollitia. Nisi aperiam cum voluptates, itaque officia magni cupiditate odio in, veniam quas perferendis nostrum est at hic necessitatibus porro? Totam harum maiores corporis et sapiente tenetur iste odio distinctio quae nesciunt sequi accusantium, in quo pariatur iure vero voluptates. Consectetur nesciunt laborum deserunt rerum facilis quam provident impedit optio unde nemo ipsam, expedita necessitatibus dolor. Expedita aut sapiente, dolore nesciunt porro optio maxime? Voluptate nulla cumque, similique porro consectetur consequatur. Possimus, mollitia exercitationem reprehenderit ea ratione officia laboriosam laudantium beatae repellat autem ut debitis placeat unde nesciunt voluptatibus quaerat sunt voluptatem, natus eos et quod iure sequi tenetur delectus! In rem illo fugit possimus quia neque placeat, sit et nemo quasi corporis voluptatum praesentium facilis necessitatibus quas suscipit voluptas, provident vero nulla iusto repellat qui? Adipisci sequi, ipsum, pariatur aspernatur sapiente quam tenetur illum culpa voluptas nobis sunt aliquid quis. Numquam hic culpa cum quibusdam sint eum amet quasi atque consequuntur consectetur rerum iure sit, quam ipsam error minima labore iusto aliquam magni praesentium quas, explicabo consequatur, quod blanditiis.</p>
    </>
  );
}

export default App;
