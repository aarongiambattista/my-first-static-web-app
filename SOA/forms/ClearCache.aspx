<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="ClearCache.aspx.cs" Inherits="Aptify.Services.Framework.forms.ClearCache" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>

            <asp:Label Text="" ID="lblResponseStatus" runat="server" />

           <asp:ListView runat="server" ID="lstViewCache">
                <LayoutTemplate>
                    <table runat="server" id="table1">
                        <tr runat="server" id="itemPlaceholder">
                        </tr>
                    </table>
                </LayoutTemplate>
                <ItemTemplate>
                    <tr id="Tr1" runat="server">
                        <td id="chkBox" runat="server">
                            <asp:CheckBox ID="Checkbox" runat="server" />
                        </td>
                        <td id="cacheName" runat="server">
                            <asp:Label ID="lblName" runat="server" Text='<%#Eval("cacheName") %>' />
                        </td>
                        <td id="cacheDescription" runat="server">
                            <asp:Label ID="lblDescription" runat="server" Text='<%#Eval("cacheDescription") %>' />
                        </td>
                        
                    </tr>
                </ItemTemplate>
            </asp:ListView>

           <asp:Button ID="btnClearSelectedCaches" runat="server" Text="Clear Cache" OnClick="ClearSelectedCaches" />
        

        </div>
    </form>
</body>
</html>
