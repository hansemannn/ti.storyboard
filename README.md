# Ti.Storyboard

Support for launch screen storyboards using Titanium Mobile and Appcelerator Studio. 
This repository is a proof of concept and will most likely be replaced by the SDK CLI in future releases.

> Note: Titanium Mobile supports launch screen storyboard since [5.2.0.GA](http://www.appcelerator.com/blog/2016/02/ga-release-of-cli-5-2-titanium-5-2-and-studio-4-5/), so this plugin is now obsolete. 

## Usage
1. Clone the plugin
2. Copy the plugin folder to `<Titanium_Application_Root>/plugins`
3. Add the plugin to your tiapp.xml:
    
    ```xml
    <plugins>
      <plugin>ti.storyboard</plugin>
    </plugins>
    ```
4. Add the following lines into the your tiapp.xml plist (or edit the existing):

    ```xml
    <ios>
    <plist>
        <dict>
          <key>UILaunchStoryboardName</key>
          <string>LaunchScreen</string>
          <key>UIRequiresFullScreen</key>
          <false/>
        </dict>
      </plist>
    </ios>
    ```
5. Add your `LaunchScreen.storyboard` into `<Titanium_Application_Root>platform/iphone`

## Notes and limitations
* No images accessible, yet
* The `<ios>` section currently needs to be changes manually, that will be part of the CLI.
