function checkIsSameElement(source: HTMLElement, target: HTMLElement): boolean {
  return source === target;
}

function checkIsDraggable(target: HTMLElement): boolean {
  const isDraggable = target.getAttribute("draggable") === "true";
  return isDraggable;
}

function checkIsSameGroup(
  group: string,
  targetGroupElement: HTMLElement,
): boolean {
  const targetGroup = targetGroupElement.getAttribute("data-group");
  return group === targetGroup;
}

export function dragStartHandler(
  event: React.DragEvent<HTMLElement>,
  info: InfoOfDraggedElement,
  opacity: string,
) {
  const target = event.target as HTMLElement;
  if (!checkIsDraggable(target)) return;

  info.group = event.currentTarget.getAttribute("data-group");
  info.source = target;
  info.source.style.opacity = opacity || "0.4";
}

export function dragEnterHandler(
  event: React.DragEvent<HTMLElement>,
  info: InfoOfDraggedElement,
  transitionDuration: number,
) {
  const target = event.target as HTMLElement;
  const { source, group } = info;
  if (checkIsSameElement(source, target)) return;
  if (!checkIsDraggable(target)) return;
  if (!checkIsSameGroup(group, event.currentTarget)) return;

  const isUp = source === target.nextElementSibling;
  const dy: number = target.offsetHeight * (isUp ? 1 : -1);
  transitionDuration = transitionDuration || 200;
  target.style.transition = `transform ${transitionDuration}ms ease 0s`;
  target.style.transform = `translate3d(0px, ${dy}px, 0px)`;
}

export function dragLeaveHandler(
  event: React.DragEvent<HTMLElement>,
  info: InfoOfDraggedElement,
) {
  const target = event.target as HTMLElement;
  const { source, group } = info;
  if (checkIsSameElement(source, target)) return;
  if (!checkIsDraggable(target)) return;
  if (!checkIsSameGroup(group, event.currentTarget)) return;

  const isUp = source === target.nextElementSibling;
  const position: InsertPosition = isUp ? "beforebegin" : "afterend";
  target.style.transition = `transform 0ms ease 0s`;
  target.style.transform = `translate3d(0px, 0px, 0px)`;
  target.insertAdjacentElement(position, source);
}

export function dragEndHandler(
  event: React.DragEvent<HTMLElement>,
  info: InfoOfDraggedElement,
) {
  const target = event.target as HTMLElement;
  const { source, group } = info;
  if (!checkIsDraggable(target)) return;
  if (!checkIsSameGroup(group, event.currentTarget)) return;

  source.style.opacity = "1.0";
  info = { source: null, group: "" };
}
