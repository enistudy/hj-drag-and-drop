

## 목표

- HTML5 Drag and Drop API를 익힐 수 있다.
- React기반의 Drag and Drop 모듈을 구현할 수 있다.

## [Deploy](https://enistudy.github.io/hj-drag-and-drop/)

## Drag and Drop 모듈

### DnDContainer

#### props

|        name        |  type  | default value | required |                                                                  description                                                                  |
| :----------------: | :----: | :-----------: | :------: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|     container      | string |       -       |    Y     |                   container의 이름. 각 container를 구분하기 위한 속성으로, container는 내부 element의 상태를 관리(할 예정.)                   |
|       group        | string |       -       |    Y     | group의 이름. 각 group를 구분하기 위한 속성으로, container가 서로 다르더라도 각 group별로 내부 element들을 공유할 수 있다.(즉, 옮길 수 있다.) |
|       items        | any[]  |       -       |    Y     |                                                            내부 element들의 상태.                                                             |
|   shadowOpacity    | string |      0.4      |    N     |                                             현재 드래그하는 element의 잔상의 투명도. (0.0 ~ 1.0)                                              |
| transitionDuration | number |      200      |    N     |                                                        animation 효과의 지속 시간(ms)                                                         |

### DnDElement

#### props

- 현재는 없음.

### Example

```react
const App: React.FC = () => {
  const items = [
    { id: 1, content: "item1" },
    { id: 2, content: "item2" },
    { id: 3, content: "item3" },
    { id: 4, content: "item4" },
    { id: 5, content: "item5" },
    { id: 6, content: "item6" },
  ];

  return (
    <DnDContainer
      container="example1"
      group="group1"
      shadowOpacity="0.6"
      transitionDuration={300}
      items={items}
      className="dnd-container"
      >
      {items.map(obj => (
        <DnDElement key={`###${obj.id}`} className="dnd-element">
          {obj.content}
        </DnDElement>
      ))}
    </DnDContainer>
  );
};
```

## 향후 계획

- 다수의 DnDContainer가 있을 경우, 같은 group 이름을 가진 Container들끼리는 각자의 element를 다른 Container에 옮길 수 있도록 구현할 예정.

  - 현재는 DnDContainer 컴포넌트가 개별적으로 드래그하고 있는 DOM을 참조하는 형식으로 구현되어 있어, 같은 group 이름을 가진 Container 끼리 현재 드래그 중인 DOM에 대한 참조를 어떻게 공유할 것인지 고민.
  - 현 구조를 많이 바꿔야 할 수 있음...

- element의 animation 효과가 약간 부자연스러움.

  - transitionend 이벤트를 통해 위에서 아래로 옮기는 것은 자연스럽게 되는데, 아래에서 위로 옮기는 것이 비정상적으로 동작.

  - 일단은 부자연스럽더라도, 정상적으로 동작하는 커밋으로 롤백.

- 현재 구조는 DOM을 직접 참조하여 구현하였는데, React의 Hook API나 Redux와 같은 상태관리 API를 사용하여 구현할 예정.

  - DOM 구조와 실제 상태 값 사이의 동기화 문제가 있어서 고민.

## HTML5 Drag and Drop Event/API

### HTML 요소를 드래그 가능하게 만들기

- HTML 요소 중 `<img>`와 `<a>` 만 기본적으로 `draggable` 속성이 true이다.

  - anchor는 href 속성이 반드시 있어야 `draggable`이 true가 된다.

  - 그 외 태그들은 `draggable` 속성을 추가해야 한다.

    ```html
    <!-- 첫번째 방법 -->
    <div draggable>...</div>

    <!-- 두번째 방법 -->
    <div class="dragElement"></div>
    ```

    ```javascript
    $(".dragElement").attr("draggable", "true");
    ```

### dragstart event

> …the user starts dragging an item.

- drag가 시작되는 순간 발생하는 Event

- 만약 드래그 앤 드랍 이벤트 중 특정 데이터를 관리하고 싶다면, dataTransfer Object를 사용하자.

#### dataTransfer Object

- dataTransfer 객체는 드래그 이벤트가 시작되고 끝날 때까지 도착지로 끌고 갈 데이터를 담을 수 있다.

- `setData` 메소드를 통해 특정 데이터를 dataTransfer 객체에 넣을 수 있다.

  - 해당 작업은 dragStart event에서 수행해야 한다. 그렇지 않으면 dragStart event 이후부터 dragEnd event 직전까지는 dataTransfer 객체를 수정할 수 없다.(readonly)

    ```javascript
    const dragStartHandler = event => {
      event.dataTransfer.setData("text/plain", "This is a sample.");
    };
    ```

  - 드래그되는 동안에는 나머지 drag and drop 이벤트 핸들러에서 `getData` 메소드를 통해 데이터를 가져올 수 있다.

### dragenter event

> …a dragged item enters a valid drop target.

> A listener for the `dragenter` and `dragover` events are used to indicate valid drop targets

- 드래그되고 있는 요소가 Drop target에 진입했을 때 발생하는 이벤트

- drop target 이란?

  - `immediate user selection` 이거나 `<body>` 가 보통 target object 이다.

    - `immediate user selection` 는 사용자가 직접 drop target으로 가르키는 요소를 말한다. => dropenter event 핸들러가 등록되어 있으면서 현재 마우스 포인트가 가르키고 있는 요소를 말한다.

    - https://www.w3.org/html/wg/spec/dnd.html#immediate-user-selection

### dragover event

> …a dragged item is being dragged over a valid drop target, every few hundred milliseconds.

- dragover event 핸들러의 기본 동작은 드래그되고 있는 요소를 다른 요소에 떨굴 수 없다(can't drop). 즉 drop event가 발생하지 않는다.

- 그렇기 때문에 drop event를 발생 시키고 싶으면 `event.preventDefault()` 메소드를 dragover event 핸들러에서 호출해야 한다.

  - dragover event에서 `event.preventDefault()`를 호출했을 경우

    ![dragover-1](https://user-images.githubusercontent.com/14218168/72676146-3f222680-3ad1-11ea-84f7-09b33dbe2789.gif)

  - dragover event에서 `event.preventDefault()`를 호출하지 않았을 경우

    ![dragover-2](https://user-images.githubusercontent.com/14218168/72676166-83152b80-3ad1-11ea-93e6-cf7f9dd0ff0e.gif)

### dragleave event

> …a dragged item leaves a valid drop target.

- drag 동작이 취소되더라도(마우스 버튼을 떼거나 esc 버튼을 누르는 경우), dragleave event는 무조건 발생한다.

### drop event

> …an item is dropped on a valid drop target.

- 드래그되고 있는 요소가 다른 요소(a valid drop target)에 드랍될 때 발생하는 이벤트이다. 한마디로, 사용자가 마우스에서 손을 떼는 순간 발생하며 drap and drop 연산이 끝나게 된다.
- drop event 핸들러에서 dataTransfer 객체의 `getData()`메소드를 호출하여 특정 데이터를 가져올 수 있다.
- 보통 drop event 핸들러에서 `event.preventDefault()` 메소드를 호출하는데, 왜냐하면 Firefox의 경우 link 태그가 드래그되었을 때 해당 link 태그가 담고 있는 링크를 열기 때문.
- https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#drop

### dragend event

> …a drag operation ends (such as releasing a mouse button or hitting the Esc key)

- dragend event는 drop target이 아닌 드래그가 시작된 요소에서 발생한다. 즉 dragstart event가 발생한 요소와 동일하다.
- drag가 성공적으로 끝났거나 취소되었을 경우 발생하며, 이 이벤트를 끝으로 드래그 작업이 끝난다.

### 그 외 Event

- [drag](https://developer.mozilla.org/en-US/docs/Web/API/Document/drag_event)
- [dragexit](https://developer.mozilla.org/en-US/docs/Web/API/Document/dragexit_event)

## 참고

- https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- https://www.html5rocks.com/en/tutorials/dnd/basics/

- https://blog.kevinchisholm.com/html5-javascript/getting-started-with-html5-drag-and-drop-part-i-introduction/
