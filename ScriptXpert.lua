local player = game.Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")
local screenGui = Instance.new("ScreenGui", playerGui)
screenGui.Name = "FOVMenu"

local mainFrame = Instance.new("Frame", screenGui)
mainFrame.Size = UDim2.new(0, 400, 0, 600)  -- Menüyü daha büyük yaptık
mainFrame.Position = UDim2.new(0.5, -200, 0.5, -300)
mainFrame.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
mainFrame.BorderSizePixel = 2
mainFrame.BorderColor3 = Color3.fromRGB(255, 255, 255)
mainFrame.Active = true
mainFrame.Draggable = true
mainFrame.Visible = false  -- Menü başlangıçta gizli

local titleLabel = Instance.new("TextLabel", mainFrame)
titleLabel.Size = UDim2.new(1, 0, 0, 50)
titleLabel.Position = UDim2.new(0, 0, 0, 0)
titleLabel.Text = "FOV & ESP & Teleport Menu"
titleLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
titleLabel.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
titleLabel.Font = Enum.Font.SourceSans
titleLabel.TextSize = 24

-- Toggle FOV Butonu
local toggleFOVButton = Instance.new("TextButton", mainFrame)
toggleFOVButton.Size = UDim2.new(0.8, 0, 0, 60)  -- Butonları biraz büyüttük
toggleFOVButton.Position = UDim2.new(0.1, 0, 0.2, 0)
toggleFOVButton.Text = "Toggle FOV"
toggleFOVButton.TextColor3 = Color3.fromRGB(0, 0, 0)
toggleFOVButton.BackgroundColor3 = Color3.fromRGB(0, 255, 0)
toggleFOVButton.Font = Enum.Font.SourceSans
toggleFOVButton.TextSize = 20

-- Toggle ESP Butonu
local toggleESPButton = Instance.new("TextButton", mainFrame)
toggleESPButton.Size = UDim2.new(0.8, 0, 0, 60)  -- Butonları biraz büyüttük
toggleESPButton.Position = UDim2.new(0.1, 0, 0.35, 0)
toggleESPButton.Text = "Toggle ESP"
toggleESPButton.TextColor3 = Color3.fromRGB(0, 0, 0)
toggleESPButton.BackgroundColor3 = Color3.fromRGB(0, 255, 0)
toggleESPButton.Font = Enum.Font.SourceSans
toggleESPButton.TextSize = 20

-- FOV Ayarları
local fov = 30
local fovEnabled = false
local FOVring = Drawing.new("Circle")
FOVring.Visible = false
FOVring.Thickness = 1
FOVring.Color = Color3.fromRGB(255, 255, 255)
FOVring.Filled = false
FOVring.Radius = fov
FOVring.Position = game.Workspace.CurrentCamera.ViewportSize / 2

local function updateDrawings()
    FOVring.Position = game.Workspace.CurrentCamera.ViewportSize / 2
end

local function toggleFOV()
    fovEnabled = not fovEnabled
    FOVring.Visible = fovEnabled
    if fovEnabled then
        toggleFOVButton.BackgroundColor3 = Color3.fromRGB(255, 0, 0) -- Kırmızı
        print("FOV Etkin")
        -- FOV'u sürekli günceller
        game:GetService("RunService"):BindToRenderStep("FOVUpdate", Enum.RenderPriority.Camera.Value, function()
            updateDrawings()
        end)
    else
        toggleFOVButton.BackgroundColor3 = Color3.fromRGB(0, 255, 0) -- Yeşil
        print("FOV Kapalı")
        game:GetService("RunService"):UnbindFromRenderStep("FOVUpdate")
    end
end

-- ESP Fonksiyonu
local espEnabled = false
local highlights = {}

local function addHighlight(player)
    if player == game.Players.LocalPlayer then return end -- Kendimize ESP eklemeyelim

    local character = player.Character or player.CharacterAdded:Wait()

    -- Highlight nesnesi oluştur
    local highlight = Instance.new("Highlight")
    highlight.Adornee = character
    highlight.FillTransparency = 1 -- İç kısmı tamamen şeffaf
    highlight.OutlineColor = Color3.new(0, 1, 1) -- Açık mavi/turkuaz renk
    highlight.OutlineTransparency = 0 -- Çizgiler tamamen görünür
    highlight.Parent = character
    table.insert(highlights, highlight)
end

local function removeHighlight(player)
    for _, highlight in ipairs(highlights) do
        if highlight.Adornee == player.Character then
            highlight:Destroy()
        end
    end
end

local function updateHighlights()
    -- ESP'yi her zaman aktif tut
    for _, player in ipairs(game.Players:GetPlayers()) do
        if player ~= game.Players.LocalPlayer then
            if player.Character and not player.Character:FindFirstChildOfClass("Highlight") then
                addHighlight(player)
            end
        end
    end
end

-- ESP'yi açıp kapatma
toggleESPButton.MouseButton1Click:Connect(function()
    espEnabled = not espEnabled

    if espEnabled then
        toggleESPButton.BackgroundColor3 = Color3.fromRGB(255, 0, 0) -- Kırmızı
        print("ESP Etkin")
        -- ESP'yi sürekli günceller
        game:GetService("RunService"):BindToRenderStep("ESPUpdate", Enum.RenderPriority.Character.Value, function()
            updateHighlights()
        end)
    else
        toggleESPButton.BackgroundColor3 = Color3.fromRGB(0, 255, 0) -- Yeşil
        print("ESP Kapalı")
        -- Highlightları temizle
        for _, player in ipairs(game.Players:GetPlayers()) do
            removeHighlight(player)
        end
        game:GetService("RunService"):UnbindFromRenderStep("ESPUpdate")
    end
end)

-- FOV TextBox ve Butonu
local fovLabel = Instance.new("TextLabel", mainFrame)
fovLabel.Size = UDim2.new(0.8, 0, 0, 30)  -- Etiketin boyutunu büyüttük
fovLabel.Position = UDim2.new(0.1, 0, 0.5, 0)
fovLabel.Text = "Set FOV (10 - 200)"
fovLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
fovLabel.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
fovLabel.Font = Enum.Font.SourceSans
fovLabel.TextSize = 18

local fovInput = Instance.new("TextBox", mainFrame)
fovInput.Size = UDim2.new(0.8, 0, 0, 40)
fovInput.Position = UDim2.new(0.1, 0, 0.55, 0)
fovInput.PlaceholderText = "Enter FOV value (10-200)"
fovInput.Text = tostring(fov)
fovInput.TextColor3 = Color3.fromRGB(0, 0, 0)
fovInput.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
fovInput.Font = Enum.Font.SourceSans
fovInput.TextSize = 20

local applyFOVButton = Instance.new("TextButton", mainFrame)
applyFOVButton.Size = UDim2.new(0.8, 0, 0, 50)
applyFOVButton.Position = UDim2.new(0.1, 0, 0.65, 0)
applyFOVButton.Text = "Apply FOV"
applyFOVButton.TextColor3 = Color3.fromRGB(255, 255, 255)
applyFOVButton.BackgroundColor3 = Color3.fromRGB(0, 255, 0)
applyFOVButton.Font = Enum.Font.SourceSans
applyFOVButton.TextSize = 20

-- FOV'yi Ayarlama
local function setFOV(value)
    local newFOV = tonumber(value)
    if newFOV and newFOV >= 10 and newFOV <= 200 then
        fov = newFOV
        FOVring.Radius = fov
        print("Yeni FOV:", fov)
    else
        warn("Geçersiz FOV değeri. Lütfen 10 ile 200 arasında bir değer girin.")
    end
end

-- FOV Ayarını Uygulama
applyFOVButton.MouseButton1Click:Connect(function()
    setFOV(fovInput.Text)
end)

-- Teleport Bölümü
local teleportLabel = Instance.new("TextLabel", mainFrame)
teleportLabel.Size = UDim2.new(0.8, 0, 0, 30)  -- Etiketin boyutunu büyüttük
teleportLabel.Position = UDim2.new(0.1, 0, 0.8, 0)
teleportLabel.Text = "Teleport To Player"
teleportLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
teleportLabel.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
teleportLabel.Font = Enum.Font.SourceSans
teleportLabel.TextSize = 18

local inputBox = Instance.new("TextBox", mainFrame)
inputBox.Size = UDim2.new(0.8, 0, 0, 40)
inputBox.Position = UDim2.new(0.1, 0, 0.85, 0)
inputBox.PlaceholderText = "Oyuncu Adını Gir"
inputBox.Text = ""
inputBox.TextColor3 = Color3.fromRGB(0, 0, 0)
inputBox.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
inputBox.Font = Enum.Font.SourceSans
inputBox.TextSize = 20

local teleportButton = Instance.new("TextButton", mainFrame)
teleportButton.Size = UDim2.new(0.8, 0, 0, 50)
teleportButton.Position = UDim2.new(0.1, 0, 0.9, 0)
teleportButton.Text = "Teleport"
teleportButton.TextColor3 = Color3.fromRGB(255, 255, 255)
teleportButton.BackgroundColor3 = Color3.fromRGB(0, 255, 0)
teleportButton.Font = Enum.Font.SourceSans
teleportButton.TextSize = 20

local function teleportToPlayer(targetPlayerName)
    local targetPlayer = game.Players:FindFirstChild(targetPlayerName)
    if targetPlayer and targetPlayer.Character and targetPlayer.Character:FindFirstChild("HumanoidRootPart") then
        local targetPosition = targetPlayer.Character.HumanoidRootPart.Position
        local character = player.Character or player.CharacterAdded:Wait()
        local humanoidRootPart = character:FindFirstChild("HumanoidRootPart")
        
        if humanoidRootPart then
            humanoidRootPart.CFrame = CFrame.new(targetPosition + Vector3.new(0, 5, 0)) -- 5 birim yukarıda ışınlanır
            print("Işınlandın:", targetPlayerName)
        end
    else
        warn("Hedef oyuncu bulunamadı veya karakteri yüklenmedi.")
    end
end

teleportButton.MouseButton1Click:Connect(function()
    local targetPlayerName = inputBox.Text
    if targetPlayerName and targetPlayerName ~= "" then
        teleportToPlayer(targetPlayerName)
    else
        warn("Oyuncu adını doğru bir şekilde giriniz.")
    end
end)

-- Toggle FOV Butonu Tıklama
toggleFOVButton.MouseButton1Click:Connect(function()
    toggleFOV()
end)

-- Menü Açma/Kapama (Sağ Ctrl Tuşu)
local menuVisible = false
game:GetService("UserInputService").InputBegan:Connect(function(input, isProcessed)
    if isProcessed then return end -- Eğer tuş başka bir işlem tarafından engellendiyse çık

    if input.KeyCode == Enum.KeyCode.RightControl then
        menuVisible = not menuVisible
        mainFrame.Visible = menuVisible
    end
end)
-- FOV Toggle
local toggleFOVButton = Instance.new("TextButton", mainFrame)
toggleFOVButton.Size = UDim2.new(0.8, 0, 0, 60)
toggleFOVButton.Position = UDim2.new(0.1, 0, 0.2, 0)
toggleFOVButton.Text = "Toggle FOV"
toggleFOVButton.TextColor3 = Color3.fromRGB(0, 0, 0)
toggleFOVButton.BackgroundColor3 = Color3.fromRGB(0, 255, 0)
toggleFOVButton.Font = Enum.Font.SourceSans
toggleFOVButton.TextSize = 20

-- Toggle FOV Function
local function toggleFOV()
    fovEnabled = not fovEnabled
    FOVring.Visible = fovEnabled
    if fovEnabled then
        toggleFOVButton.BackgroundColor3 = Color3.fromRGB(255, 0, 0) -- Red
        print("FOV Enabled")
        -- FOV update
        game:GetService("RunService"):BindToRenderStep("FOVUpdate", Enum.RenderPriority.Camera.Value, function()
            updateDrawings()
        end)
    else
        toggleFOVButton.BackgroundColor3 = Color3.fromRGB(0, 255, 0) -- Green
        print("FOV Disabled")
        game:GetService("RunService"):UnbindFromRenderStep("FOVUpdate")
    end
end

-- Button click to toggle FOV
toggleFOVButton.MouseButton1Click:Connect(function()
    toggleFOV()
end)

-- Key press (H) to toggle FOV
game:GetService("UserInputService").InputBegan:Connect(function(input, isProcessed)
    if isProcessed then return end -- Ignore if the input is already processed
    if input.KeyCode == Enum.KeyCode.H then
        toggleFOV()
    end
end)
local fov = 30
local RunService = game:GetService("RunService")
local UserInputService = game:GetService("UserInputService")
local Players = game:GetService("Players")
local Cam = game.Workspace.CurrentCamera

-- FOV Çemberi
local FOVring = Drawing.new("Circle")
FOVring.Visible = false
FOVring.Thickness = 1  -- Çizim kalınlığını ince yaptık
FOVring.Color = Color3.fromRGB(255, 255, 255) -- Beyaz renk
FOVring.Filled = false
FOVring.Radius = fov
FOVring.Position = Cam.ViewportSize / 2

local enabled = false -- Varsayılan olarak kapalı

-- Çizimleri güncelleme fonksiyonu
local function updateDrawings()
    if not enabled then return end
    local camViewportSize = Cam.ViewportSize
    FOVring.Position = camViewportSize / 2
end

-- Kamerayı hedefe çevirme fonksiyonu
local function lookAt(target)
    local lookVector = (target - Cam.CFrame.Position).Unit
    local newCFrame = CFrame.new(Cam.CFrame.Position, Cam.CFrame.Position + lookVector)
    Cam.CFrame = newCFrame
end

-- Görüş alanındaki en yakın oyuncuyu bulma fonksiyonu
local function getClosestPlayerInFOV(trg_part)
    if not enabled then return nil end
    local nearest = nil
    local last = math.huge
    local playerMousePos = Cam.ViewportSize / 2

    for _, player in ipairs(Players:GetPlayers()) do
        if player ~= Players.LocalPlayer then
            local character = player.Character
            local part = character and character:FindFirstChild(trg_part)
            if part then
                local ePos, isVisible = Cam:WorldToViewportPoint(part.Position)
                local distance = (Vector2.new(ePos.X, ePos.Y) - playerMousePos).Magnitude

                if isVisible and distance < last and distance < fov then
                    last = distance
                    nearest = player
                end
            end
        end
    end

    return nearest
end

-- Tuş algılama
UserInputService.InputBegan:Connect(function(input, isProcessed)
    if isProcessed then return end -- Eğer tuş başka bir işlem tarafından engellendiyse çık

    if input.KeyCode == Enum.KeyCode.H then
        enabled = not enabled -- Aktiflik durumunu değiştir
        FOVring.Visible = enabled -- FOV çemberini görünür yap veya gizle

        if enabled then
            -- FOV sistemi etkinleştirildi
            RunService:BindToRenderStep("FOVUpdate", Enum.RenderPriority.Camera.Value, function()
                updateDrawings()
                local closest = getClosestPlayerInFOV("Head")
                if closest and closest.Character and closest.Character:FindFirstChild("Head") then
                    lookAt(closest.Character.Head.Position)
                end
            end)
        else
            -- FOV sistemi devre dışı bırakıldı
            RunService:UnbindFromRenderStep("FOVUpdate")
        end
    end

    if input.KeyCode == Enum.KeyCode.Delete then
        -- Delete tuşuna basıldığında çemberi kaldır
        RunService:UnbindFromRenderStep("FOVUpdate")
        FOVring:Remove()
    end
end)
-- FOV Toggle
local toggleFOVButton = Instance.new("TextButton", mainFrame)
toggleFOVButton.Size = UDim2.new(0.8, 0, 0, 60)
toggleFOVButton.Position = UDim2.new(0.1, 0, 0.2, 0)
toggleFOVButton.Text = "Toggle FOV"
toggleFOVButton.TextColor3 = Color3.fromRGB(0, 0, 0)
toggleFOVButton.BackgroundColor3 = Color3.fromRGB(0, 255, 0)
toggleFOVButton.Font = Enum.Font.SourceSans
toggleFOVButton.TextSize = 20

-- FOV ring drawing
local FOVring = Drawing.new("Circle")
FOVring.Visible = false
FOVring.Thickness = 1  -- Set drawing thickness
FOVring.Color = Color3.fromRGB(255, 255, 255) -- White color
FOVring.Filled = false
FOVring.Radius = 30 -- Initial FOV radius
FOVring.Position = game.Workspace.CurrentCamera.ViewportSize / 2

-- FOV Enable state
local fovEnabled = false

-- Update the drawing position
local function updateDrawings()
    if not fovEnabled then return end
    local camViewportSize = game.Workspace.CurrentCamera.ViewportSize
    FOVring.Position = camViewportSize / 2
end

-- Camera look at target function
local function lookAt(target)
    local lookVector = (target - game.Workspace.CurrentCamera.CFrame.Position).Unit
    local newCFrame = CFrame.new(game.Workspace.CurrentCamera.CFrame.Position, game.Workspace.CurrentCamera.CFrame.Position + lookVector)
    game.Workspace.CurrentCamera.CFrame = newCFrame
end

-- Get the closest player to the FOV ring
local function getClosestPlayerInFOV(trg_part)
    if not fovEnabled then return nil end
    local nearest = nil
    local last = math.huge
    local playerMousePos = game.Workspace.CurrentCamera.ViewportSize / 2

    for _, player in ipairs(game.Players:GetPlayers()) do
        if player ~= game.Players.LocalPlayer then
            local character = player.Character
            local part = character and character:FindFirstChild(trg_part)
            if part then
                local ePos, isVisible = game.Workspace.CurrentCamera:WorldToViewportPoint(part.Position)
                local distance = (Vector2.new(ePos.X, ePos.Y) - playerMousePos).Magnitude

                if isVisible and distance < last and distance < FOVring.Radius then
                    last = distance
                    nearest = player
                end
            end
        end
    end

    return nearest
end

-- Toggle FOV
local function toggleFOV()
    fovEnabled = not fovEnabled
    FOVring.Visible = fovEnabled

    if fovEnabled then
        toggleFOVButton.BackgroundColor3 = Color3.fromRGB(255, 0, 0) -- Red
        print("FOV Enabled")
        -- Update the FOV circle constantly
        game:GetService("RunService"):BindToRenderStep("FOVUpdate", Enum.RenderPriority.Camera.Value, function()
            updateDrawings()

            -- Get the closest player in FOV and look at their head
            local closest = getClosestPlayerInFOV("Head")
            if closest and closest.Character and closest.Character:FindFirstChild("Head") then
                lookAt(closest.Character.Head.Position)
            end
        end)
    else
        toggleFOVButton.BackgroundColor3 = Color3.fromRGB(0, 255, 0) -- Green
        print("FOV Disabled")
        -- Stop updating the FOV circle and look at behavior
        game:GetService("RunService"):UnbindFromRenderStep("FOVUpdate")
    end
end

-- Button click to toggle FOV
toggleFOVButton.MouseButton1Click:Connect(function()
    toggleFOV()
end)

-- Key press (H) to toggle FOV
game:GetService("UserInputService").InputBegan:Connect(function(input, isProcessed)
    if isProcessed then return end -- Ignore if the input is already processed
    if input.KeyCode == Enum.KeyCode.H then
        toggleFOV() -- Call toggleFOV when the "H" key is pressed
    end
end)
-- FOV Çemberi
local FOVring = Drawing.new("Circle")
FOVring.Visible = false
FOVring.Thickness = 1  -- Çizim kalınlığını ince yaptık
FOVring.Color = Color3.fromRGB(255, 255, 255) -- Beyaz renk
FOVring.Filled = false
FOVring.Radius = fov
FOVring.Position = game.Workspace.CurrentCamera.ViewportSize / 2

local fovEnabled = false -- Varsayılan olarak kapalı

-- Çizimleri güncelleme fonksiyonu
local function updateDrawings()
    if not fovEnabled then return end
    local camViewportSize = game.Workspace.CurrentCamera.ViewportSize
    FOVring.Position = camViewportSize / 2
end

-- Kamerayı hedefe çevirme fonksiyonu
local function lookAt(target)
    local lookVector = (target - game.Workspace.CurrentCamera.CFrame.Position).Unit
    local newCFrame = CFrame.new(game.Workspace.CurrentCamera.CFrame.Position, game.Workspace.CurrentCamera.CFrame.Position + lookVector)
    game.Workspace.CurrentCamera.CFrame = newCFrame
end

-- Görüş alanındaki en yakın oyuncuyu bulma fonksiyonu
local function getClosestPlayerInFOV(trg_part)
    if not fovEnabled then return nil end
    local nearest = nil
    local last = math.huge
    local playerMousePos = game.Workspace.CurrentCamera.ViewportSize / 2

    for _, player in ipairs(game.Players:GetPlayers()) do
        if player ~= game.Players.LocalPlayer then
            local character = player.Character
            local part = character and character:FindFirstChild(trg_part)
            if part then
                local ePos, isVisible = game.Workspace.CurrentCamera:WorldToViewportPoint(part.Position)
                local distance = (Vector2.new(ePos.X, ePos.Y) - playerMousePos).Magnitude

                if isVisible and distance < last and distance < FOVring.Radius then
                    last = distance
                    nearest = player
                end
            end
        end
    end

    return nearest
end

-- Toggle FOV
local function toggleFOV()
    fovEnabled = not fovEnabled
    FOVring.Visible = fovEnabled

    if fovEnabled then
        toggleFOVButton.BackgroundColor3 = Color3.fromRGB(255, 0, 0) -- Kırmızı
        print("FOV Etkinleştirildi")
        -- FOV güncelleme ve en yakın oyuncuya yönelme
        game:GetService("RunService"):BindToRenderStep("FOVUpdate", Enum.RenderPriority.Camera.Value, function()
            updateDrawings()

            -- FOV içindeki en yakın oyuncuya bak
            local closest = getClosestPlayerInFOV("Head")
            if closest and closest.Character and closest.Character:FindFirstChild("Head") then
                lookAt(closest.Character.Head.Position)
            end
        end)
    else
        toggleFOVButton.BackgroundColor3 = Color3.fromRGB(0, 255, 0) -- Yeşil
        print("FOV Devre Dışı")
        -- FOV güncellemeyi durdur
        game:GetService("RunService"):UnbindFromRenderStep("FOVUpdate")
    end
end

-- FOV Ayarlarını Güncelleme
local function setFOV(value)
    local newFOV = tonumber(value)
    if newFOV and newFOV >= 10 and newFOV <= 200 then
        fov = newFOV
        FOVring.Radius = fov
        print("Yeni FOV:", fov)

        -- Eğer FOV etkinse, en yakın oyuncuya yönel
        if fovEnabled then
            local closest = getClosestPlayerInFOV("Head")
            if closest and closest.Character and closest.Character:FindFirstChild("Head") then
                lookAt(closest.Character.Head.Position)
            end
        end
    else
        warn("Geçersiz FOV değeri. Lütfen 10 ile 200 arasında bir değer girin.")
    end
end

-- Button click to toggle FOV
toggleFOVButton.MouseButton1Click:Connect(function()
    toggleFOV()
end)

-- Key press (H) to toggle FOV
game:GetService("UserInputService").InputBegan:Connect(function(input, isProcessed)
    if isProcessed then return end -- Eğer tuş başka bir işlem tarafından engellendiyse çık
    if input.KeyCode == Enum.KeyCode.H then
        toggleFOV() -- H tuşu ile FOV açma/kapama
    end
end)

-- FOV TextBox ve Butonu
applyFOVButton.MouseButton1Click:Connect(function()
    setFOV(fovInput.Text)
end)
-- Close Button
local closeButton = Instance.new("TextButton", mainFrame)
closeButton.Size = UDim2.new(0, 50, 0, 50)
closeButton.Position = UDim2.new(1, -50, 0, 0)  -- Right top corner
closeButton.Text = "X"
closeButton.TextColor3 = Color3.fromRGB(255, 255, 255)
closeButton.BackgroundColor3 = Color3.fromRGB(255, 0, 0)  -- Red background
closeButton.Font = Enum.Font.SourceSans
closeButton.TextSize = 24

-- Function to hide the menu when close button is clicked
closeButton.MouseButton1Click:Connect(function()
    mainFrame:Destroy()  -- Completely remove the menu from the game
    closeButton:Destroy()  -- Remove the close button as well
end)
mainFrame.BackgroundTransparency = 0.3
mainFrame.BackgroundColor3 = Color3.fromRGB(50, 50, 50)

-- Shadow Effect (Optional)
mainFrame:Clone().Parent = screenGui
mainFrame.Size = UDim2.new(0, 405, 0, 605)
mainFrame.Position = UDim2.new(0.5, -202, 0.5, -303)
mainFrame.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
mainFrame.BackgroundTransparency = 0.6
mainFrame.ZIndex = 0
local fovSlider = Instance.new("Slider", mainFrame)
fovSlider.Size = UDim2.new(0.8, 0, 0, 30)
fovSlider.Position = UDim2.new(0.1, 0, 0.55, 0)
fovSlider.MinValue = 10
fovSlider.MaxValue = 200
fovSlider.Value = fov
fovSlider.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
fovSlider.BorderSizePixel = 1
fovSlider.ValueChanged:Connect(function(value)
    fov = value
    FOVring.Radius = fov
end)

-- Display the FOV value dynamically as the slider is moved
local fovValueDisplay = Instance.new("TextLabel", mainFrame)
fovValueDisplay.Size = UDim2.new(0.8, 0, 0, 30)
fovValueDisplay.Position = UDim2.new(0.1, 0, 0.6, 0)
fovValueDisplay.Text = "FOV: " .. tostring(fov)
fovValueDisplay.TextColor3 = Color3.fromRGB(255, 255, 255)
fovValueDisplay.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
fovValueDisplay.Font = Enum.Font.SourceSans
fovValueDisplay.TextSize = 18

fovSlider.Changed:Connect(function()
    fovValueDisplay.Text = "FOV: " .. tostring(fovSlider.Value)
end)
