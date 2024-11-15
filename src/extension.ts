import * as vscode from "vscode";

class TreeNode extends vscode.TreeItem {
  constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState) {
    super(label, collapsibleState);
    this.checkboxState = vscode.TreeItemCheckboxState.Checked;
  }
}

class TreeViewProvider implements vscode.TreeDataProvider<TreeNode> {
  /**
   * An array of all of the items in the tree, to test the check box state.
   */
  allItems: TreeNode[] = [];
  onDidChangeTreeDataEmitter = new vscode.EventEmitter<TreeNode | void>();
  onDidChangeTreeData = this.onDidChangeTreeDataEmitter.event;
  getTreeItem(element: TreeNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: TreeNode | undefined): vscode.ProviderResult<TreeNode[]> {
    const children = [];
    if (element === undefined) {
      this.allItems = [];
      children.push(new TreeNode("parent", vscode.TreeItemCollapsibleState.Collapsed));
    } else if (element.label === "parent") {
      children.push(new TreeNode("child", vscode.TreeItemCollapsibleState.None));
    }
    this.allItems.push(...children);
    return children;
  }
}

export function activate(context: vscode.ExtensionContext) {
  const treeDataProvider = new TreeViewProvider();

  const treeView = vscode.window.createTreeView("checkboxTest", {
    treeDataProvider,
    manageCheckboxStateManually: true,
  });
  context.subscriptions.push(treeView);

  treeView.onDidChangeCheckboxState((e) => {
    if (e.items.length === 0) {
      console.log("No items have been included in onDidChangeCheckboxState.");
    }
    for (const [item, checkboxState] of e.items) {
      const state = checkboxState === vscode.TreeItemCheckboxState.Checked ? "checked" : "unchecked";
      console.log(`Changed ${item.label} to ${state}`);
    }
    // Manually check the checkbox state of each of the items in the tree.
    for (const item of treeDataProvider.allItems) {
      const state = item.checkboxState === vscode.TreeItemCheckboxState.Checked ? "checked" : "unchecked";
      console.log(`${item.label} is ${state}`);
    }
  });
}

export function deactivate() {}
